

# **Deepseek OCR 启发下的 Agent 记忆压缩可行性分析**

## **第一部分 奠基：解构上下文光学压缩技术**

本节旨在深入剖析支撑新型记忆机制的核心技术。我们将详细拆解其架构、性能表现，及其所代表的范式转移——从一维线性文本流转向二维视觉信息画布。

### **1.1 范式转移：从线性文本Token到二维视觉表征**

“上下文光学压缩”（Contexts Optical Compression）是一种处理长文本的新颖方法，其核心在于首先将文本内容渲染为二维图像，再进行处理 1。这一操作从根本上改变了输入模态，从传统的文本Token序列转变为像素的空间排列。

这一范式转移旨在解决当前大语言模型（LLM）面临的一个核心瓶颈。基于Transformer架构的自注意力机制，其计算复杂度和内存占用随输入序列长度呈二次方增长（$O(n^2)$），这使得处理极长文本序列的成本极为高昂，成为限制LLM和需要长期记忆的智能体发展的关键技术障碍 1。

DeepSeek-OCR技术背后的核心假设是：一张包含文档文本的图像，可以用远少于等效数字文本的Token数量来表征其丰富的内涵 3。这一观点颠覆了传统认知中视觉Token信息密度低于文本Token的看法 6。该技术将这种高压缩率视为一项关键特性，而非一种固有的局限性 6。通过这种方式，光学压缩为突破LLM的长上下文限制提供了一条充满前景的研究路径。

### **1.2 架构分析：DeepEncoder的混合式感知与压缩设计**

DeepSeek-OCR是一个统一的端到端视觉语言模型（VLM），由两个核心组件构成：参数量为3.8亿的DeepEncoder编码器，以及拥有5.7亿激活参数的DeepSeek3B-MoE-A570M解码器 4。其中，DeepEncoder是实现光学压缩的关键引擎，其并非一个单一模块，而是一个精心设计的三段式串行处理流水线 3。

1. **视觉感知（局部处理）**：流水线的第一阶段采用了一个8000万参数的SAM-base模型，利用窗口化注意力（Windowed Attention）机制来处理高分辨率输入图像。该组件专为细粒度的局部感知而优化，能高效识别字符、形状和布局元素，而无需承担全局注意力带来的巨大计算开销 5。  
2. **Token压缩器（信息瓶颈）**：在局部感知之后，一个双层的卷积模块对SAM生成的视觉Token进行16倍的降采样。这是一个至关重要的步骤，它在将Token送入计算成本更高的全局注意力组件之前，极大地减少了Token的数量，从而有效管理了计算和内存资源 3。  
3. **视觉知识（全局理解）**：经过压缩的Token被送入一个经过修改的、拥有3亿参数的CLIP-large模型。该组件利用全局注意力机制，负责提取高层次的语义信息，并将视觉表征与语言模型的潜在空间进行对齐，从而实现对图像内容的整体理解 2。

这种架构设计并非组件的简单堆砌，而是模拟了一个从感知到概念的层级化信息处理流程。SAM的窗口化注意力如同一个低阶的**感知引擎**，高效扫描局部细节，但不求甚解。卷积压缩器则扮演了信息瓶颈的角色，迫使系统将繁杂的局部感知提炼为更抽象、更浓缩的概要。最后，经过文本-视觉对齐预训练的CLIP模型处理这个压缩后的概要，将其映射到一个高阶的**概念空间**，供语言解码器理解。这一流程与人类认知过程有异曲同工之妙：先观察细节（感知），再形成概括性的心理图像（抽象），最后理解其主旨（概念）。这种“感知-概念漏斗”式的设计，是其区别于扁平化Transformer架构并实现高计算效率的关键。

此外，该系统并非一成不变，它支持多种分辨率模式，从适用于简单布局的“Tiny”模式（64个视觉Token）到处理复杂高分文档的“Gundam”模式（少于800个视觉Token），展示了其动态适应不同任务需求的能力 1。

### **1.3 性能与保真度：量化压缩与信息损失的权衡**

上下文光学压缩的有效性最终体现在其压缩率与信息保真度的平衡上。

* **核心性能指标**：在压缩比低于10倍（即用1个视觉Token表征10个文本Token）的情况下，模型能够实现约97%的OCR解码精度 1。  
* **平滑的性能衰减**：模型的性能并非断崖式下跌。当压缩比增加到11-12倍时，精度下降至约90%；在20倍的极限压缩比下，精度仍能维持在60%左右 1。这种可预测的性能衰减特性对于记忆系统至关重要，因为它允许在保真度与成本之间进行可控的权衡。  
* **顶尖的效率表现**：在如OmniDocBench等行业基准测试中，DeepSeek-OCR以显著更少的Token消耗超越了现有模型。例如，它仅用100个视觉Token就超越了使用256个Token的GOT-OCR2.0，用少于800个Token的表现优于平均消耗6000+ Token的MinerU2.0 3。

从压缩率与准确率的关系曲线中，可以发现这不仅仅是一个性能度量，更是一条经验性的“遗忘成本”曲线 1。这条曲线为构建一个动态的记忆管理系统提供了量化依据。可以赋予一个智能体总体的“Token预算”来管理其记忆。系统可以根据记忆的年限或重要性，在这条曲线上选择一个操作点。例如，一个关键的近期记忆可以按8倍压缩率存储（高保真度、高成本），而一个琐碎的陈旧记忆则可以按20倍压缩率存储（低保真度、低成本）。这种机制将记忆管理从简单的“存储/删除”二元操作，转变为一个在无限信息流中动态分配有限“保真度预算”的经济学问题。这为实现论文中提到的“渐进式记忆遗忘”机制提供了一条直接且可量化的路径 5。

## **第二部分 现状：AI智能体记忆架构的批判性审视**

本节旨在通过审视当前主流的智能体记忆范式，为评估视觉压缩记忆的创新性与影响力建立一个基准。理解现有方案的优势，尤其是其根本性局限，是至关重要的。

### **2.1 检索增强生成（RAG）的主导地位与固有缺陷**

检索增强生成（RAG）通过将从外部知识库（通常是向量数据库）检索到的信息补充到LLM的提示中，使其生成的内容能够基于事实且与时俱进，从而在当前智能体架构中占据主导地位 13。然而，这一范式存在多个难以克服的内在缺陷。

* **对检索质量的严重依赖**：RAG系统的性能上限完全受限于其检索组件，遵循“垃圾进，垃圾出”的原则。检索器可能因算法偏差或关键词不匹配而返回不相关、过时或带有偏见的信息，而LLM则会基于这些有缺陷的输入，自信地生成错误的答案 15。  
* **“分块的噩梦”**：将源文档切分成离散的文本块是RAG流程中的一个核心挑战。文本块过小会丢失必要的上下文，过大则会引入无关噪声，干扰LLM的理解。这种对信息的武断分割是导致系统出错的根源之一 16。  
* **语义鸿沟**：检索常常因为同义词或用户查询与文档术语之间的表述差异而失败（例如，用户搜索“远程办公”，而文档中只包含“居家办公”），导致大量相关内容无法被有效召回 16。  
* **性能与可扩展性瓶颈**：检索步骤显著增加了系统的响应延迟和计算开销，使得部署大规模、实时的RAG应用充满挑战 15。  
* **缺乏整体性上下文**：RAG检索的是信息的碎片，而非源知识的完整结构或叙事逻辑。这导致了“上下文脱节”问题，LLM只能生硬地将检索到的片段拼接在一起，生成的内容连贯性差 15。

深入分析RAG及其他主流文本记忆系统的共同点，可以发现它们都基于离散的文本单元（如文本块或知识图谱节点）进行操作 13。这种“分块”或“节点化”的行为，在本质上破坏了源信息中连续的语境和逻辑流，这正是“分块噩梦”和“上下文脱节”问题的根源 15。系统被迫基于一组不连贯的碎片进行推理，而非一个整体性的表征。这构成了一种根本性的架构缺陷，可称之为**语义碎片化**：记忆系统自身施加的人为结构，反而破坏了它试图保存的上下文。

### **2.2 新兴替代方案：图记忆、程序化记忆与自组织记忆**

为了克服RAG的局限，研究界正在探索多种新型记忆架构。根据一个全面的分类法，AI记忆可以从对象（个人 vs. 系统）、形式（参数化 vs. 非参数化）和时间（短期 vs. 长期）等多个维度进行划分 20。

* **基于图的记忆**：这类系统将信息存储为知识图谱中的节点和边，旨在比向量相似性更明确地捕捉实体间的关系 19。这有助于进行多跳推理，但其结构相对僵化，更新和维护成本较高。  
* **程序化记忆**：这类记忆专注于存储和复用成功的“轨迹”或行为序列，例如Memp框架 23。它非常适合学习和优化任务执行流程，但对于存储陈述性知识则能力有限。  
* **智能体式记忆（Agentic Memory）**：这是一个更前沿的概念，代表作如A-Mem系统。在这种范式下，智能体能够动态地自我组织记忆，自主建立连接并演化其记忆结构，而不依赖于预设的、固定的操作 22。这种受Zettelkasten等方法启发的机制，标志着记忆管理正朝着更自主的方向发展。

观察这些新兴方案的发展趋势，可以发现一个从被动存储到主动管理的演变过程。早期的记忆系统只是简单的数据库，用于存储对话历史等信息 19。RAG引入了“检索-生成”的推理步骤，但记忆库本身仍然是被动的 13。而A-Mem等新概念则引入了一个元认知层：智能体不仅使用记忆，更在**管理**记忆。它自主决定链接什么、总结什么、何时需要重新查询 18。这反映了AI记忆设计理念的转变——从一个静态的外部设备，演变为一个动态、活跃的认知过程，这与人类心理学的观点不谋而合 21。挑战不再仅仅是“如何存储”，而是“如何组织和自我完善”。

| 特性 | 检索增强生成 (RAG) | 基于图的记忆 | 程序化记忆 | 视觉压缩记忆 (VCM) (提议) |
| :---- | :---- | :---- | :---- | :---- |
| **存储单元** | 文本块 (Text Chunks) | 节点/边 (Nodes/Edges) | 行为轨迹 (Action Trajectories) | 压缩视觉Token (Compressed Visual Tokens) |
| **检索机制** | 向量相似性搜索 | 图遍历/查询 | 轨迹匹配 | 多模态语义搜索 |
| **存储可扩展性** | 中等 (受限于向量数据库性能) | 中等 (图数据库扩展复杂) | 高 (轨迹数据易于存储) | 极高 (Token压缩率极高) |
| **计算可扩展性** | 低 (检索与生成开销大) | 中等 (图查询开销可变) | 高 (轨迹匹配快) | 高 (上下文Token数量少) |
| **核心优势** | 事实性、可更新性 | 关系推理 | 任务学习、技能复用 | 极高的存储和计算效率 |
| **主要局限** | 语义碎片化、检索质量依赖 | 结构僵化、更新困难 | 适用范围窄 (偏向任务) | 检索精度、信息保真度有损 |

### **2.3 未解的瓶颈：为何长期记忆仍是巨大挑战**

尽管技术不断进步，但所有现行记忆系统仍在上下文窗口大小、计算成本和长期信息保真度这三个维度之间艰难权衡 18。大多数系统，包括RAG和图数据库，都依赖于相对静态、预定义的结构，这限制了智能体在面对新类型信息时的适应能力 22。因此，构建一个既能无限扩展、又能高效检索且保持高保真度的长期记忆系统，仍然是AI领域的一项重大挑战。

## **第三部分 提案：视觉压缩记忆（VCM）新范式**

本节将基于DeepSeek-OCR论文中的讨论，系统性地阐述视觉压缩记忆（Visually Compressed Memory, VCM）的核心框架，将其从一个概念性的启发，发展为一个连贯的技术提案。

### **3.1 概念框架：通过渐进式压缩模拟认知记忆衰退**

VCM的核心思想是，将“上下文光学压缩”技术从OCR任务中解放出来，用作AI智能体的长期记忆存储机制 1。论文明确指出，该技术在“历史长上下文压缩和LLM的记忆遗忘机制”方面具有巨大潜力 7。

这一机制的设计灵感源于生物的认知过程：人类的近期记忆生动而详尽，而远期记忆则变得模糊和抽象，只保留了核心要点 1。VCM通过**渐进式压缩**（Progressive Compression）来模拟这一过程。具体实现方式是动态调整记忆的视觉表征分辨率，或更精确地说，是调整用于表征记忆的视觉Token数量。

* **近期记忆**：以较低的压缩比（例如8倍，保真度 \> 95%）进行存储，以保留丰富的细节信息。  
* **陈旧记忆**：随着时间的推移或重要性的降低，记忆会被逐步“重新压缩”到更高的比率（例如15倍、20倍），从而丢弃细枝末节，但保留事件的“主旨” 5。这是一种可控的、有损的压缩形式。

这种机制并非传统计算系统中的“删除”操作——一种二元且不可逆的过程。VCM引入了**信息衰减**的概念。将一个旧记忆从10倍压缩到20倍，是一种主动“遗忘”细节，同时保留核心要义的行为。这是一种范式上的转变，它允许智能体拥有“记忆半衰期”。信息不会突然消失，而是随着时间或相关性的变化，其保真度平滑地降低。这为终身学习的智能体提供了一个远比二元删除更健壮、更符合心理学现实的记忆模型 1。这也为智能体控制引入了新的维度：可以将“遗忘速率”作为一个超参数进行调整，从而在记忆容量和历史精度之间取得平衡。

### **3.2 记忆的生命周期：编码、存储与回忆**

VCM中的记忆处理遵循一个完整的生命周期：

1. **编码（摄入）**：一个事件、一段对话、一份文档或一次状态观察，首先被渲染成一个标准化的二维图像。这张图像随后被送入一个专为记忆设计的“MemEncoder”（一个适配版的DeepEncoder），生成一组压缩的视觉Token。  
2. **存储（持久化）**：这些视觉Token集被存入一个“视觉记忆库”。这不仅仅是一个文件存储系统，它还需要建立索引以便后续检索（详见第四部分）。  
3. **回忆（检索与解码）**：当智能体需要访问某段记忆时，一个查询被用来从记忆库中检索相关的视觉Token集。这些Token随后与智能体当前的上下文和查询一起，被送入LLM的解码器，由解码器重建出原始的文本信息 5。

### **3.3 理论优势：效率、可扩展性与多模态潜力**

VCM范式在理论上具备多项显著优势：

* **存储效率**：极大地降低了记忆的Token足迹。一段10万Token的对话历史，理论上可能仅需1万个视觉Token即可存储，这使得从存储成本角度看，近乎无限的记忆成为可能 5。  
* **计算可扩展性**：通过将代表上下文的Token数量维持在较低水平，VCM有效缓解了注意力机制的二次方扩展问题。智能体可以在拥有海量记忆库的同时，其推理的计算成本不会随之线性增长 2。  
* **内生的多模态性**：VCM的记忆格式天然是视觉的。这为存储和推理真正的多模态记忆（如图像、图表、UI布局）提供了原生支持，而文本只是被渲染成图像的特例 2。

VCM的视觉格式还扮演了\*\*“规范化信息画布”\*\*的角色。AI领域的一大挑战是融合异构数据类型（文本、表格、图像、代码），每种类型都有其独特的Token化方案。VCM通过在编码前将所有信息渲染到二维图像上，强制将其统一为单一格式。表格变成了视觉上的表格，文本变成了文本的图像，UI截图本身就是图像。经过多样化视觉数据（包括文本、图表、公式）训练的DeepEncoder，为所有这些概念学习了一个统一的潜在空间 3。这在数据摄入阶段就解决了一个重大的融合难题，智能体的记忆不再需要处理不同数据类型，一切皆为由视觉Token表征的“场景”，极大地简化了下游的检索和推理架构。

## **第四部分 从理论到实践：可行性与实施路径**

本节将从概念走向实践，在评估VCM实际可行性的基础上，勾勒出一个可行的系统架构和分阶段的研发路线图。

### **4.1 技术可行性评估**

* **计算成本**：尽管推理成本低，但初始的编码（渲染+DeepEncoder前向传播）成本不可忽略。然而，这对于每条记忆来说是一次性成本。根据论文报告，单张A100 GPU每天可处理超过20万页文档，这表明该技术对于生产级系统而言是高度实用的 3。此外，用于实现记忆衰减的“再压缩”成本也需要纳入考量。  
* **信息完整性**：在10倍压缩比下97%的准确率虽然很高，但并非完美。对于需要精确事实回忆的场景，3%的错误率可能是灾难性的（例如，颠倒了一个否定词）。这表明VCM可能更适用于保存“要点”或上下文背景类记忆，而非逐字逐句的事实记录。  
* **动态更新**：如何更新一条已存的记忆？检索、解码、编辑文本，然后重新编码整个视觉记忆的过程效率低下。与直接在RAG系统中编辑文本文档相比，这是一个显著的挑战。

### **4.2 提议的系统架构**

一个完整的VCM系统需要三个核心模块：

* “MemEncoder”（记忆摄入模块）：  
  该模块的功能超越了简单的OCR。它需要一个标准化的“渲染器”，能够接收各种数据类型（如JSON、对话日志、代码差异、用户偏好等），并将它们转换为虚拟画布上一致的视觉布局，然后再送入DeepEncoder。这些视觉模板的设计本身就是一个关键的研究问题。  
* “视觉记忆库”（索引与存储模块）：  
  这是一个特化的数据库，用于存储压缩的视觉Token（作为有效载荷）以及相关的元数据（如时间戳、来源、重要性评分等）。  
  其索引策略是关键。一个简单的方法是，对视觉Token集的全局CLIP嵌入建立向量索引，以支持宽泛的语义搜索 29。为了实现更细粒度的检索，可能需要多向量或层级化的索引方法，例如对单个记忆中的特定Token或Token组进行索引。这种思路受到了图像编解码器中可伸缩潜在空间划分技术的启发 31。  
* “检索头”（查询模块）：  
  该模块必须在用户的文本查询和视觉记忆库之间架起桥梁。  
  提议的机制是采用一个双编码器模型。一个文本编码器（如BERT）将用户查询嵌入为向量。一个投影网络将这个文本嵌入映射到与MemEncoder相同的视觉潜在空间中。这样，检索就转变为在这个共享的多模态潜在空间中进行最近邻搜索 29。  
  这一设计直接借鉴了现有视觉Token剪枝研究中的相关技术，即利用文本相似性来引导注意力或选择相关的视觉Token 32。本质上，这个检索头将扮演一个“文本引导的视觉记忆选择器”的角色。

### **4.3 分阶段研发路线图**

1. **第一阶段（概念验证）**：针对单一数据类型（如对话日志）实施系统。使用现成的DeepSeek-OCR模型，专注于验证“编码-存储-检索-解码”循环的有效性，并对保真度与压缩率的关系进行基准测试。  
2. **第二阶段（高级渲染与检索）**：开发能够处理多种数据类型的规范化渲染器。实施并试验更先进的检索头（例如，在检索到的视觉Token上运行文本引导的注意力机制），以提升搜索精度。  
3. **第三阶段（动态记忆管理）**：实施“记忆衰减”机制。开发策略，根据记忆的年限、访问频率或智能体的明确指令来触发再压缩操作。  
4. **第四阶段（混合系统集成）**：将VCM与传统的RAG系统集成。在这种混合架构中，VCM提供长期的、低成本的上下文背景，而RAG则负责高保真度的、精确的事实召回。

## **第五部分 关键挑战与未决问题**

本节将进行严谨的反向分析，识别VCM成为一项可行技术之前必须克服的最重大的技术和概念障碍。

### **5.1 检索困境：在抽象视觉空间中进行语义搜索**

* **核心问题**：如何在一个以抽象视觉形式存储的记忆中，找到一个“大海捞针”式的特定事实？例如，一个文本查询“十月份会议上预测的第三季度收入是多少？”需要与一张表格的**图像**进行匹配。  
* **向量搜索的局限性**：虽然全局的CLIP嵌入可以匹配记忆的整体**主题**（例如“财务会议”），但它可能难以区分包含略微不同数字的表格图像。在这类需要精确查找的查询上，RAG的直接文本搜索具有明显优势。  
* **对“视觉定位”的需求**：检索机制需要能够“透视”压缩的视觉表征内部，而不仅仅是进行整体匹配。这可能需要一个更复杂的检索流程，例如两阶段搜索：首先通过全局相似性找到候选记忆，然后运行一个成本更高的解码器或注意力机制来核查特定细节。但这又会重新引入延迟问题。

### **5.2 语义漂移风险：高压缩记忆中的信息损失**

* **设计的本质是有损的**：VCM从根本上说是一种有损压缩方案 12。在20倍压缩比下60%的准确率是一个鲜明的提醒 1。  
* **灾难性错误**：与图像压缩中一些像素失真尚可接受不同，在文本中，丢失一个词（如“不”）或颠倒几个数字，就可能完全扭曲记忆的含义。系统无法保证其保留的“60%的信息”恰好是那最重要的60%。  
* **错误传播**：如果智能体基于从一个高度压缩的视觉Token重建出的错误记忆进行推理，可能会导致其决策链出现级联失败。如何验证压缩后记忆的语义完整性，是一个巨大且尚未解决的挑战。

### **5.3 抽象的障碍：非文本与概念性记忆的表征**

* **简单场景**：对于那些本身就是视觉的或易于可视化的记忆（如文档、网页、图表），VCM是一个自然的选择。  
* **困难场景**：如何为一个抽象的记忆，如“用户的目标是写一部小说”或“我学会了Python编程这项技能”，创建一个视觉表征？  
* **“模板”问题**：这可能需要为不同类型的抽象概念创建标准化的视觉模板。这个过程不仅繁琐，而且可能很脆弱，并引入了一层可能导致智能体记忆和推理产生偏差的人为设计选择。这背离了直接编码源数据的简洁性。

### **5.4 正面对比：VCM与RAG的技术分解**

| 维度 | 视觉压缩记忆 (VCM) | 传统检索增强生成 (RAG) |
| :---- | :---- | :---- |
| **存储成本 (每100万文本Token)** | 极低 (约10万-20万视觉Token) | 高 (约100万文本Token \+ 向量嵌入) |
| **记忆更新成本** | 高 (需重新渲染和编码) | 低 (直接编辑文本块和更新向量) |
| **检索延迟 (“要点”查询)** | 低 (全局向量匹配快) | 中等 (依赖向量数据库性能) |
| **检索延迟 (特定事实查询)** | 高 (可能需要两阶段搜索或解码) | 中等 (直接匹配文本内容) |
| **保真度/逐字召回** | 低 (有损压缩，保真度可调) | 高 (无损存储，精确召回) |
| **多模态数据处理** | 原生支持 (所有信息统一为视觉格式) | 困难 (需要独立的、异构的处理流程) |
| **抽象概念处理** | 困难 (需要设计视觉模板) | 相对容易 (直接存储为文本描述) |
| **主要失效模式** | 信息失真导致语义错误 | 检索失败或返回不相关内容 |

## **第六部分 结论：战略建议与未来展望**

本节将综合所有分析，对VCM技术的可行性给出最终结论，并为未来的研究和开发提供可操作的建议。

### **6.1 关于视觉压缩记忆可行性的最终定论**

**结论**：视觉压缩记忆（VCM）是一种极具潜力但应用场景高度特化的记忆范式。它**并非RAG的通用替代品**。其核心优势在于以极低的Token成本存储海量、非关键的历史上下文信息，实现了前所未有的效率。其主要弱点则在于高保真、低延迟地检索特定事实的困难性，以及记忆更新的复杂性。

**定论**：作为更大型、混合式记忆架构的一个组件，VCM的**技术可行性非常高**。

### **6.2 战略性研发投资建议**

1. **投资混合式架构**：研发重点应放在创建集成VCM和RAG的系统上。VCM应被用作一个长期的、低成本的“上下文缓存”或“情景记忆”，提供广阔的历史背景感知；而RAG则继续扮演高保真“语义记忆”的角色，负责精确的事实查找。  
2. **优先投入检索研究**：当前最大的技术瓶颈在于检索。应投入大量研究资源，为这些压缩的视觉潜在空间开发新颖的索引和查询技术，重点关注文本引导的注意力和多阶段搜索策略。  
3. **建立“语义安全”度量标准**：在将VCM部署到关键应用之前，需要研究并创建能够验证记忆在压缩后语义完整性的度量标准。我们需要知道丢失的是**哪种类型**的信息，而不仅仅是丢失了多少信息。

### **6.3 记忆的未来：多模态压缩在智能体架构中的角色**

**更广泛的启示**：DeepSeek-OCR论文的提案是一个开创性的例子，它预示了一个更大的趋势：将多模态压缩作为AI架构的核心组成部分。随着智能体在日益丰富、多模态的环境中运作，将来自不同模态的经验压缩并存入一个统一、高效的Token格式的能力，将成为下一代系统的决定性特征之一。

**最终思考**：VCM不仅是一种存储文本的新方法，它更是一个蓝图，描绘了智能体如何在非纯文本的世界中建立可扩展的、终身的记忆。它对待记忆的方式，不再是将其视为一个待查询的数据库，而是将其看作一幅待感知的、由过往经验构成的画卷。

#### **Works cited**

1. DeepSeek-OCR: Contexts Optical Compression | alphaXiv, accessed on October 27, 2025, [https://www.alphaxiv.org/overview/2510.18234v1](https://www.alphaxiv.org/overview/2510.18234v1)  
2. Seeing Is Compressing: How DeepSeek-OCR Redefines AI's Memory Limits \- Medium, accessed on October 27, 2025, [https://medium.com/@dinmaybrahma/seeing-is-compressing-how-deepseek-ocr-redefines-ais-memory-limits-31bb8a3e4ccc](https://medium.com/@dinmaybrahma/seeing-is-compressing-how-deepseek-ocr-redefines-ais-memory-limits-31bb8a3e4ccc)  
3. DeepSeek-OCR: Revolutionary Context Compression Through Optical 2D Mapping, accessed on October 27, 2025, [https://deepseek.ai/blog/deepseek-ocr-context-compression](https://deepseek.ai/blog/deepseek-ocr-context-compression)  
4. DeepSeek-OCR: Contexts Optical Compression \- arXiv, accessed on October 27, 2025, [https://arxiv.org/html/2510.18234v1](https://arxiv.org/html/2510.18234v1)  
5. DeepSeek OCR is here \- Medium, accessed on October 27, 2025, [https://medium.com/data-science-in-your-pocket/deepseek-ocr-is-here-37096b562bb0](https://medium.com/data-science-in-your-pocket/deepseek-ocr-is-here-37096b562bb0)  
6. The Innovations in DeepSeek OCR : r/LocalLLaMA \- Reddit, accessed on October 27, 2025, [https://www.reddit.com/r/LocalLLaMA/comments/1obn0q7/the\_innovations\_in\_deepseek\_ocr/](https://www.reddit.com/r/LocalLLaMA/comments/1obn0q7/the_innovations_in_deepseek_ocr/)  
7. \[2510.18234\] DeepSeek-OCR: Contexts Optical Compression \- arXiv, accessed on October 27, 2025, [https://www.arxiv.org/abs/2510.18234](https://www.arxiv.org/abs/2510.18234)  
8. DeepSeek OCR \- alphaXiv, accessed on October 27, 2025, [https://www.alphaxiv.org/models/deepseek/deepseek-ocr](https://www.alphaxiv.org/models/deepseek/deepseek-ocr)  
9. DeepSeek’s new AI model can generate 200K pages of training data daily on a single GPU, accessed on October 27, 2025, [https://indianexpress.com/article/technology/artificial-intelligence/deepseek-new-ai-model-generate-200k-pages-training-data-single-gpu-10318599/](https://indianexpress.com/article/technology/artificial-intelligence/deepseek-new-ai-model-generate-200k-pages-training-data-single-gpu-10318599/)  
10. Deepseek's new tool can extract text from photos of pages: What it means for users, accessed on October 27, 2025, [https://timesofindia.indiatimes.com/technology/tech-news/deepseeks-new-tool-can-extract-text-from-photos-of-pages-what-it-means-for-users/articleshow/124725207.cms](https://timesofindia.indiatimes.com/technology/tech-news/deepseeks-new-tool-can-extract-text-from-photos-of-pages-what-it-means-for-users/articleshow/124725207.cms)  
11. deepseek-ai/DeepSeek-OCR: Contexts Optical Compression \- GitHub, accessed on October 27, 2025, [https://github.com/deepseek-ai/DeepSeek-OCR](https://github.com/deepseek-ai/DeepSeek-OCR)  
12. New Deepseek model drastically reduces resource usage by converting text and documents into images — 'vision-text compression' uses up to 20 times fewer tokens | Tom's Hardware, accessed on October 27, 2025, [https://www.tomshardware.com/tech-industry/artificial-intelligence/new-deepseek-model-drastically-reduces-resource-usage-by-converting-text-and-documents-into-images-vision-text-compression-uses-up-to-20-times-fewer-tokens](https://www.tomshardware.com/tech-industry/artificial-intelligence/new-deepseek-model-drastically-reduces-resource-usage-by-converting-text-and-documents-into-images-vision-text-compression-uses-up-to-20-times-fewer-tokens)  
13. Retrieval Augmented Generation (RAG) for LLMs \- Prompt Engineering Guide, accessed on October 27, 2025, [https://www.promptingguide.ai/research/rag](https://www.promptingguide.ai/research/rag)  
14. Retrieval-augmented generation \- Wikipedia, accessed on October 27, 2025, [https://en.wikipedia.org/wiki/Retrieval-augmented\_generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)  
15. Everything Wrong with Retrieval-Augmented Generation ..., accessed on October 27, 2025, [https://www.leximancer.com/blog/everything-wrong-with-retrieval-augmented-generation](https://www.leximancer.com/blog/everything-wrong-with-retrieval-augmented-generation)  
16. RAG Limitations: 7 Critical Challenges You Need to Know \- Stack AI, accessed on October 27, 2025, [https://www.stack-ai.com/blog/rag-limitations](https://www.stack-ai.com/blog/rag-limitations)  
17. arxiv.org, accessed on October 27, 2025, [https://arxiv.org/html/2401.05856v1](https://arxiv.org/html/2401.05856v1)  
18. RAG: Fundamentals, Challenges, and Advanced Techniques | Label Studio, accessed on October 27, 2025, [https://labelstud.io/blog/rag-fundamentals-challenges-and-advanced-techniques/](https://labelstud.io/blog/rag-fundamentals-challenges-and-advanced-techniques/)  
19. Survey of AI Agent Memory Frameworks | Graphlit Blog, accessed on October 27, 2025, [https://www.graphlit.com/blog/survey-of-ai-agent-memory-frameworks](https://www.graphlit.com/blog/survey-of-ai-agent-memory-frameworks)  
20. Survey of Memory Mechanisms in LLMs \- Emergent Mind, accessed on October 27, 2025, [https://www.emergentmind.com/papers/2504.15965](https://www.emergentmind.com/papers/2504.15965)  
21. nuster1128/LLM\_Agent\_Memory\_Survey \- GitHub, accessed on October 27, 2025, [https://github.com/nuster1128/LLM\_Agent\_Memory\_Survey](https://github.com/nuster1128/LLM_Agent_Memory_Survey)  
22. A-Mem: Agentic Memory for LLM Agents \- arXiv, accessed on October 27, 2025, [https://arxiv.org/html/2502.12110v1](https://arxiv.org/html/2502.12110v1)  
23. AI Agent Memory Management: It's Not Just About the Context Limit \- noailabs, accessed on October 27, 2025, [https://noailabs.medium.com/ai-agent-memory-management-its-not-just-about-the-context-limit-7013146f90cf](https://noailabs.medium.com/ai-agent-memory-management-its-not-just-about-the-context-limit-7013146f90cf)  
24. A-MEM: Agentic Memory for LLM Agents \- arXiv, accessed on October 27, 2025, [https://arxiv.org/pdf/2502.12110](https://arxiv.org/pdf/2502.12110)  
25. Building AI Agents with Memory and Tools Using DeepSeek \- HackMD, accessed on October 27, 2025, [https://hackmd.io/@WMDKzWe5R1y2NkIHlC4-FA/BJZON8vkxl](https://hackmd.io/@WMDKzWe5R1y2NkIHlC4-FA/BJZON8vkxl)  
26. \[2507.22925\] Hierarchical Memory for High-Efficiency Long-Term ... \- arXiv, accessed on October 27, 2025, [https://arxiv.org/abs/2507.22925](https://arxiv.org/abs/2507.22925)  
27. DeepSeek AI Unveils DeepSeek-OCR: Vision-Based Context Compression Redefines Long-Text Processing \- InfoQ, accessed on October 27, 2025, [https://www.infoq.com/news/2025/10/deepseek-ocr/](https://www.infoq.com/news/2025/10/deepseek-ocr/)  
28. DeepSeek-OCR: A Deep Dive into Architecture and Context Optical Compression | by azhar, accessed on October 27, 2025, [https://moazharu.medium.com/deepseek-ocr-a-deep-dive-into-architecture-and-context-optical-compression-dc65778d0f33](https://moazharu.medium.com/deepseek-ocr-a-deep-dive-into-architecture-and-context-optical-compression-dc65778d0f33)  
29. Latent space \- Wikipedia, accessed on October 27, 2025, [https://en.wikipedia.org/wiki/Latent\_space](https://en.wikipedia.org/wiki/Latent_space)  
30. What Is Latent Space? | IBM, accessed on October 27, 2025, [https://www.ibm.com/think/topics/latent-space](https://www.ibm.com/think/topics/latent-space)  
31. Joint image compression and denoising via latent-space scalability \- Frontiers, accessed on October 27, 2025, [https://www.frontiersin.org/journals/signal-processing/articles/10.3389/frsip.2022.932873/full](https://www.frontiersin.org/journals/signal-processing/articles/10.3389/frsip.2022.932873/full)  
32. Recoverable Compression: A Multimodal Vision Token Recovery Mechanism Guided by Text Information | Proceedings of the AAAI Conference on Artificial Intelligence, accessed on October 27, 2025, [https://ojs.aaai.org/index.php/AAAI/article/view/32229](https://ojs.aaai.org/index.php/AAAI/article/view/32229)  
33. Recoverable Compression: A Multimodal Vision Token Recovery Mechanism Guided by Text Information \- arXiv, accessed on October 27, 2025, [https://arxiv.org/html/2409.01179v1](https://arxiv.org/html/2409.01179v1)  
34. DeepSeek-OCR Architecture Explained: How This Vision-Language Model Works, accessed on October 27, 2025, [https://skywork.ai/blog/ai-agent/deepseek-ocr-architecture-explained/](https://skywork.ai/blog/ai-agent/deepseek-ocr-architecture-explained/)