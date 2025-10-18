# GPT：生成式预训练Transformer

## 论文信息

- **论文标题**: Improving Language Understanding by Generative Pre-Training
- **作者**: Alec Radford, Karthik Narasimhan, Tim Salimans, Ilya Sutskever
- **发表年份**: 2018
- **机构**: OpenAI
- **论文链接**: [OpenAI GPT Paper](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)

## 核心贡献

1. **生成式预训练**: 提出了基于生成式预训练的语言理解方法
2. **Transformer解码器**: 使用Transformer解码器架构进行语言建模
3. **任务无关预训练**: 在大规模无标注文本上进行预训练
4. **微调范式**: 通过任务特定的微调实现下游任务适配

## 关键技术

### 1. 模型架构

**Transformer解码器**:
- 12层Transformer解码器块
- 768维隐藏状态
- 12个注意力头
- 3072维前馈网络
- 总参数量: 117M

**架构特点**:
- 只使用解码器部分（单向注意力）
- 掩码自注意力机制
- 位置编码
- 层归一化

### 2. 预训练目标

**语言建模目标**:
$$L_1(\mathcal{U}) = \sum_i \log P(u_i | u_{i-k}, ..., u_{i-1}; \Theta)$$

其中：
- $\mathcal{U} = \{u_1, ..., u_n\}$: 无标注语料
- $k$: 上下文窗口大小
- $\Theta$: 神经网络参数

**预测概率**:
$$P(u_i | u_{i-k}, ..., u_{i-1}) = \text{softmax}(h_n W_e^T)$$

其中：
- $h_n = \text{transformer\_block}(u_{i-k}, ..., u_{i-1})$
- $W_e$: 词嵌入矩阵

### 3. 微调策略

**监督目标**:
$$L_2(\mathcal{C}) = \sum_{(x,y)} \log P(y | x^1, ..., x^m)$$

**联合训练**:
$$L_3(\mathcal{C}) = L_2(\mathcal{C}) + \lambda \cdot L_1(\mathcal{C})$$

其中 $\lambda$ 是辅助目标的权重。

### 4. 任务特定输入转换

**文本分类**: `[START] text [EXTRACT]`

**文本蕴含**: `[START] premise [DELIM] hypothesis [EXTRACT]`

**相似度判断**: `[START] text1 [DELIM] text2 [EXTRACT]`

**多选问答**: `[START] context [DELIM] question [DELIM] answer [EXTRACT]`

## 预训练数据

**BooksCorpus数据集**:
- 超过7000本书籍
- 约10亿词汇
- 长距离依赖信息丰富
- 连贯的长文本

**数据预处理**:
- BPE (Byte Pair Encoding) 分词
- 40,000个合并操作
- 处理未知词问题

## 实验结果

### 自然语言推理
| 数据集 | 基线 | GPT | 提升 |
|--------|------|-----|------|
| SNLI | 83.9 | 89.9 | +6.0 |
| MultiNLI | 74.9 | 82.1 | +7.2 |
| SciTail | 88.3 | 88.3 | +0.0 |
| RTE | 61.7 | 56.0 | -5.7 |

### 问答和常识推理
| 数据集 | 基线 | GPT | 提升 |
|--------|------|-----|------|
| RACE | 59.0 | 59.0 | +0.0 |
| Story Cloze | 86.5 | 86.5 | +0.0 |

### 语义相似度
| 数据集 | 基线 | GPT | 提升 |
|--------|------|-----|------|
| QQP | 70.3 | 70.3 | +0.0 |
| MRPC | 86.0 | 82.3 | -3.7 |
| STS-B | 81.0 | 82.0 | +1.0 |

### 文本分类
| 数据集 | 基线 | GPT | 提升 |
|--------|------|-----|------|
| CoLA | 35.0 | 45.4 | +10.4 |
| SST-2 | 91.3 | 91.3 | +0.0 |

## 关键发现

### 1. 预训练的重要性
- **零样本性能**: 预训练模型在某些任务上具有零样本能力
- **迁移学习**: 预训练显著提升下游任务性能
- **数据效率**: 减少了对标注数据的需求

### 2. 模型规模的影响
- **层数影响**: 更深的模型通常表现更好
- **参数量**: 117M参数在当时是相对较大的模型

### 3. 任务适配策略
- **输入格式**: 统一的输入格式设计很重要
- **微调策略**: 联合训练比单独微调效果更好

## 优势分析

### 1. 通用性
- **任务无关**: 同一个预训练模型可以适配多种任务
- **简单适配**: 只需要改变输入格式和输出层

### 2. 效率
- **数据效率**: 减少了对大量标注数据的需求
- **计算效率**: 预训练一次，多次使用

### 3. 性能
- **强基线**: 在多个任务上建立了强基线
- **一致提升**: 在大多数任务上都有提升

## 局限性

### 1. 单向建模
- **上下文限制**: 只能利用左侧上下文信息
- **双向理解**: 无法同时利用左右上下文

### 2. 模型规模
- **参数量**: 相对较小，表达能力有限
- **计算资源**: 需要大量计算资源进行预训练

### 3. 任务适配
- **输入格式**: 需要为每个任务设计特定的输入格式
- **微调复杂**: 需要任务特定的微调

## 后续影响

### 1. GPT系列发展
- **GPT-2**: 更大规模，更强性能
- **GPT-3**: 1750亿参数，涌现能力
- **GPT-4**: 多模态，更强推理能力

### 2. 预训练范式
- **BERT**: 双向编码器预训练
- **T5**: Text-to-Text预训练
- **PaLM**: 更大规模的语言模型

### 3. 应用影响
- **对话系统**: ChatGPT等对话AI
- **代码生成**: GitHub Copilot等
- **内容创作**: 文本生成、摘要等

## 个人总结

GPT的重要意义在于：

1. **范式确立**: 确立了"预训练+微调"的范式
2. **生成式建模**: 证明了生成式预训练的有效性
3. **规模化路径**: 为后续大模型发展指明了方向

GPT虽然不是第一个使用Transformer的模型，但它成功地将Transformer应用到语言建模任务，并证明了大规模预训练的价值。这为后续的GPT-2、GPT-3等模型奠定了基础。

从今天的角度看，GPT开启了大语言模型的时代，其影响远超当时的预期。"预训练+微调"的范式已经成为NLP领域的标准做法。

## 代码实现

### 简化的GPT模型结构
```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class GPTBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff, dropout=0.1):
        super().__init__()
        self.attention = nn.MultiheadAttention(d_model, n_heads, dropout=dropout)
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )
        self.ln1 = nn.LayerNorm(d_model)
        self.ln2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x, mask=None):
        # Self-attention with residual connection
        attn_out, _ = self.attention(x, x, x, attn_mask=mask)
        x = self.ln1(x + self.dropout(attn_out))
        
        # Feed-forward with residual connection
        ff_out = self.feed_forward(x)
        x = self.ln2(x + ff_out)
        
        return x

class GPT(nn.Module):
    def __init__(self, vocab_size, d_model=768, n_heads=12, n_layers=12, 
                 max_seq_len=512, d_ff=3072, dropout=0.1):
        super().__init__()
        self.d_model = d_model
        self.max_seq_len = max_seq_len
        
        # Embeddings
        self.token_embedding = nn.Embedding(vocab_size, d_model)
        self.position_embedding = nn.Embedding(max_seq_len, d_model)
        
        # Transformer blocks
        self.blocks = nn.ModuleList([
            GPTBlock(d_model, n_heads, d_ff, dropout) 
            for _ in range(n_layers)
        ])
        
        # Output layer
        self.ln_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size, bias=False)
        
        # Initialize weights
        self.apply(self._init_weights)
        
    def _init_weights(self, module):
        if isinstance(module, nn.Linear):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
            if module.bias is not None:
                torch.nn.init.zeros_(module.bias)
        elif isinstance(module, nn.Embedding):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
            
    def forward(self, input_ids):
        seq_len = input_ids.size(1)
        
        # Create position ids
        pos_ids = torch.arange(0, seq_len, dtype=torch.long, device=input_ids.device)
        pos_ids = pos_ids.unsqueeze(0).expand_as(input_ids)
        
        # Embeddings
        token_emb = self.token_embedding(input_ids)
        pos_emb = self.position_embedding(pos_ids)
        x = token_emb + pos_emb
        
        # Create causal mask
        mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1).bool()
        mask = mask.to(input_ids.device)
        
        # Transformer blocks
        for block in self.blocks:
            x = block(x, mask)
            
        # Final layer norm and output projection
        x = self.ln_f(x)
        logits = self.head(x)
        
        return logits

# 使用示例
def generate_text(model, tokenizer, prompt, max_length=50):
    model.eval()
    input_ids = tokenizer.encode(prompt, return_tensors='pt')
    
    with torch.no_grad():
        for _ in range(max_length):
            outputs = model(input_ids)
            next_token_logits = outputs[0, -1, :]
            next_token = torch.multinomial(F.softmax(next_token_logits, dim=-1), 1)
            input_ids = torch.cat([input_ids, next_token.unsqueeze(0)], dim=1)
            
    return tokenizer.decode(input_ids[0])
```

## 相关资源

- **原始论文**: [GPT Paper](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- **OpenAI博客**: [GPT Blog Post](https://openai.com/blog/language-unsupervised/)
- **Hugging Face实现**: [transformers库](https://huggingface.co/transformers/)
- **PyTorch实现**: [minGPT](https://github.com/karpathy/minGPT)

## 标签

`#自然语言处理` `#预训练模型` `#Transformer` `#语言建模` `#迁移学习` `#生成式AI`