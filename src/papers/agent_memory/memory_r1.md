# Memory-R1：通过强化学习增强大型语言模型智能体管理和利用记忆

## 论文信息

- **论文标题**: Memory-R1: Enhancing Large Language Model Agents to Manage and Utilize Memories via Reinforcement Learning
- **作者**: 
- **发表年份**: 
- **机构**: 
- **论文链接**: 

keys

Memory-R1，这是一个强化学习（RL）框架，它通过两个专门的代理使 LLMs 能够主动管理和利用外部内存：一个学习结构化操作的内存管理器（包括 ADD、UPDATE、DELETE 和 NOOP）；以及一个预先选择和推理相关条目的回答代理。这两个代理都使用结果导向的强化学习（PPO 和 GRPO）进行微调，从而实现自适应内存管理，只需极少量的监督。仅使用 152 个训练 QA 对，Memory-R1 就优于强大的基线，并在多种模型规模（3B–14B）上泛化到不同的题型、三个基准（LoCoMo、MSC、LongMemEval）中。


在 LoCoMo 基准测试（Maharana 等人，2024 年）中，Memory-R1 相较于最具竞争力的基线 Mem0（Chhikara 等人，2025 年）取得了显著提升。使用 LLaMA-3.1-8B-Instruct 主干网络，Memory-R1-GRPO 在 F1 指标上实现了 48%的相对提升，BLEU-1 指标上实现了 69%的相对提升，以及 LLM-as-a-Judge 指标上实现了 37%的相对提升。


例如，Toolformer（Schick 等人，2023 年）和 ReAct 风格的代理（Yao 等人，2023 年）将工具使用视为一个 RL 问题，其中 LLM 学习何时查询外部工具或 API。Search-R1（Jin 等人，2025 年）使用 RL 训练 LLM 以发出网络搜索查询，以最大化最终答案的正确性。


我们使用近端策略优化（PPO；Schulman 等人，2017 年）对记忆管理器进行微调。