# 模型上下文协议（MCP）

## 概述

Model Context Protocol (MCP) 是一个开放协议，旨在实现大语言模型(LLM)与外部数据和工具的无缝集成。它就像AI的"通用适配器"，类似于设备的USB-C或网络通信的HTTP。

### 定义和核心目的

MCP是一个标准化协议，用于：
- 提供对实时数据的标准化访问（如天气、数据库等）
- 安全的工具执行（如发送邮件、文件操作等）
- 为任务自动化提供预定义的提示模板

### 为什么需要MCP？

#### 解决LLM的局限性
1. **静态知识问题**：克服过时的训练数据限制
2. **领域特定数据缺口**：弥合医疗记录等专业数据的访问gap

#### 开发者收益
1. **集成时间节省**：通过预构建的连接器（GitHub、Slack等）减少开发时间
2. **模型无关设计**：可以在Claude、GPT-4等不同模型间自由切换

## 核心架构

### 三个核心组件

1. **Host（主机）**：LLM应用程序（如Claude Desktop、IDE插件）
2. **Client（客户端）**：负责Host-Server通信的中介（每个Server对应一个Client）
3. **Server（服务器）**：轻量级程序，暴露工具/资源（本地/远程）

### 协议层
- **消息协议**：JSON-RPC 2.0
- **传输方式**：支持stdio和SSE（Server-Sent Events）

## 核心功能

### 1. Tools（工具）

LLM可调用的预定义、可执行函数：

- **结构化模式**：工具遵循结构化模式（如带输入验证的"search-documents"）
- **功能示例**：文档搜索、数据库查询、API调用等

#### 结构化工具输出（2025年6月更新）

```json
// Tool定义
{
  "name": "search_documents",
  "description": "Search through documents",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {"type": "string"}
    }
  },
  "outputSchema": {
    "type": "object", 
    "properties": {
      "results": {
        "type": "array",
        "items": {"type": "string"}
      }
    }
  }
}

// 工具调用结果
{
  "structuredContent": {
    "results": ["Document 1", "Document 2"]
  }
}
```

### 2. Resources（资源）

通过URI访问的外部数据源（只读）：

- **数据源类型**：文件、API响应、云存储等
- **URI示例**：
  - `file:///reports/q3_results.csv`
  - `https://api.weather.gov/alerts/active`
- **多模态支持**：纯文本、二进制数据（如图片）

#### 资源链接支持（2025年6月更新）

工具可以在结果中返回资源链接，提供额外的上下文或数据：

```json
{
  "callToolResult": {
    "content": [
      {
        "type": "text",
        "text": "Found relevant documents"
      }
    ],
    "links": [
      {
        "uri": "file:///path/to/document.pdf",
        "description": "Related document"
      }
    ]
  }
}
```

### 3. Prompts（提示）

可重用的自然语言模板：

- **动态插槽**：支持运行时上下文注入（如`{customer_name}`）
- **使用场景**：代码分析、报告生成等
- **示例**：`"使用{tone: polite|formal|urgent}语气回复{customer_email}"`

#### 上下文字段支持（2025年6月更新）

```json
{
  "completionRequest": {
    "prompt": "Analyze this code",
    "context": {
      "previously_resolved_variables": {
        "project_name": "MyApp",
        "language": "Python"
      }
    }
  }
}
```

## 在应用中的MCP

### 传统方式 vs MCP方式

#### 传统方式的问题
- 每个应用需要单独集成各种外部服务
- 重复的连接器开发工作
- 缺乏标准化，难以维护

#### MCP方式的优势
- 标准化的集成接口
- 可重用的MCP服务器
- 模型无关的设计
- 简化的维护和扩展

### MCP工具 vs 传统Agent工具

| 特性 | 传统Agent工具 | MCP工具 |
|-----|-------------|---------|
| **位置** | 绑定到Agent，随Agent部署 | 独立运行，通过MCP Server提供标准化服务 |
| **调用方式** | 直接通过function_call触发 | 通过MCP协议，由MCP协调分发 |
| **标准化** | 无标准化，依赖特定框架 | 标准化协议，统一交互模式 |
| **扩展性** | 需要代码修改，扩展困难 | MCP Server独立更新即可生效 |

### 与框架的集成

#### LangChain集成
```python
from langchain_community.tools import MCPTool

# 使用MCP工具
mcp_tool = MCPTool(
    server_url="http://localhost:3000",
    tool_name="search_documents"
)
```

#### OpenAI Agent SDK集成
```python
from openai.agents import Agent
from mcp_client import MCPClient

# 集成MCP客户端
mcp_client = MCPClient("http://localhost:3000")
agent = Agent(
    tools=mcp_client.get_tools(),
    model="gpt-4"
)
```

## 部署和实现

### 本地MCP Server

基本的本地MCP服务器实现：

```python
from mcp import MCPServer

server = MCPServer()

@server.tool("get_weather")
def get_weather(city: str) -> str:
    # 天气查询逻辑
    return f"Weather in {city}: Sunny, 26°C"

@server.resource("file://documents/{path}")
def get_document(path: str):
    # 文档访问逻辑
    with open(path, 'r') as f:
        return f.read()

server.run()
```

### 远程MCP Server - Cloudflare

#### 部署架构
```
Client Application → Cloudflare Workers → MCP Server
```

#### 认证和授权
- **workers-oauth-provider**：完整的OAuth 2.1提供者库
- **授权功能**：为MCP服务器API端点添加授权功能
- **灵活的认证集成**：
  - 第三方身份提供者（Google、GitHub等）
  - 开发者自己的认证系统
- **双层令牌架构**：MCP服务器不直接传递上游服务提供者的令牌，而是向MCP客户端签发自己的令牌
- **权限隔离**：细粒度的权限控制

### Zapier MCP集成

Zapier通过MCP协议提供对7000+第三方应用和30000+操作的访问：

```
LLM Application → MCP Client → Zapier MCP Server → 7000+ Apps
```

## 公共MCP服务

### MCP服务市场
- [GitHub官方服务器集合](https://github.com/modelcontextprotocol/servers)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [Smithery.ai](https://smithery.ai/)
- [PulseMCP](https://www.pulsemcp.com/)
- [MCP Servers](https://mcpservers.org/)
- [MCP.so](https://mcp.so/)
- [Glama.ai MCP Servers](https://glama.ai/mcp/servers)

### 中国云平台支持

#### 阿里云百炼
- URL: https://bailian.console.aliyun.com/?tab=mcp#/mcp-market
- 提供MCP市场和服务集成

#### ModelScope
- URL: https://www.modelscope.cn/mcp
- 支持MCP协议和服务

#### 腾讯云开发
- URL: https://tcb.cloud.tencent.com/dev
- 在AI服务中集成MCP支持

## MCP协议更新

### 2025年3月更新

#### 1. 能力协商
- 建立协议版本兼容性
- 交换和协商功能能力
- 共享实现细节

```json
{
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {},
      "resources": {},
      "prompts": {}
    }
  }
}
```

#### 2. 授权支持
- OAuth 2.0 + 2.1支持
- OAuth 2.0动态客户端注册协议(RFC7591)
- 支持的OAuth授权类型：
  - Authorization Code
  - Client Credentials
- 第三方授权流程

#### 3. 可流式HTTP传输
- **单端点设计**：使用单一HTTP端点支持POST和GET方法
- **双向通信**：
  - 客户端通过HTTP POST发送JSON-RPC消息
  - 服务器通过JSON或SSE流响应
- **流式功能**：支持并发SSE流进行服务器到客户端的消息传递
- **会话管理**：通过`Mcp-Session-Id`头部进行有状态会话管理

### 2025年6月更新

#### 1. 移除JSON-RPC批处理支持
- **缺乏实用案例**：在实现TypeScript和Python SDK的可流式HTTP传输时，未发现批处理的compelling用例
- **规范限制**：当前规范不支持响应和通知的混合（因为JSON-RPC不支持）
- **有限价值**：即使支持，与实时SSE更新相比，延迟通知捆绑的价值有限
- **并行工具调用**：可通过水平扩展轻松实现，特别是在无状态模式下

#### 2. MCP服务器作为OAuth资源服务器
MCP服务器被归类为OAuth 2.1资源服务器，并实现RFC9728：

```json
{
  "protected_resource_metadata": {
    "resource": "https://example.com/mcp",
    "authorization_servers": [
      "https://auth.example.com"
    ]
  }
}
```

- MCP客户端必须使用OAuth 2.0 Protected Resource Metadata进行授权服务器发现
- 推荐支持OAuth 2.0动态客户端注册协议(RFC7591)

#### 3. 征求支持(Elicitation)
提供标准化方式让服务器在交互过程中通过客户端向用户请求额外信息：

```json
{
  "method": "elicitation/request",
  "params": {
    "message": "Please provide your email address",
    "actions": ["accept", "reject", "cancel"]
  }
}
```

三种响应操作：Accept / Reject / Cancel

#### 4. 其他更新
- **标题字段**：为人性化显示名称添加title字段
- **上下文字段**：为CompletionRequest添加context字段
- **_meta字段**：为其他接口类型添加_meta字段

## 服务器完成功能

MCP服务器可以提供代码完成功能，帮助开发者在编写与MCP相关的代码时获得智能提示：

```json
{
  "method": "completion/complete",
  "params": {
    "ref": {
      "type": "ref/resource",
      "uri": "file:///path/to/file.py"
    },
    "argument": {
      "name": "query",
      "value": "search for"
    }
  }
}
```

## 认证和授权最佳实践

### 建议的认证流程

对于平台集成，建议采用以下简化的认证流程：

1. **集中式登录**：在一个平台上完成登录流程
2. **更好的用户体验**：用户只需登录一次
3. **应用维护访问令牌**：应用程序维护访问令牌用于MCP客户端和服务器间的通信
4. **MCP服务器职责**：
   - 不负责令牌签发
   - 仅通过OAuth服务验证令牌
   - 令牌无效时返回401
5. **MCP客户端处理**：接收到401时触发登录流程

### 实现考虑

在实际实现中需要考虑的问题：
- OAuth端点中缺少state参数支持
- 无法在认证端点添加额外参数（如acr_value）
- 动态客户端注册的支持程度

## 总结

MCP (Model Context Protocol) 代表了AI工具集成的标准化未来。通过提供统一的协议、丰富的功能集合（工具、资源、提示）以及强大的部署选项，MCP使得开发者能够更容易地构建功能强大、可扩展的AI应用程序。

随着协议的不断演进和生态系统的发展，MCP正在成为连接LLM与外部世界的标准桥梁，为AI应用的未来发展奠定了坚实的基础。