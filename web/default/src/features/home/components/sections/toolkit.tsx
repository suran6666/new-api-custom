/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import {
  ArrowUpRight,
  Boxes,
  Code2,
  Command,
  Download,
  TerminalSquare,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'

type ToolkitTone = 'blue' | 'emerald' | 'violet' | 'amber'

interface ToolkitItem {
  name: string
  eyebrow: string
  description: string
  href: string
  tone: ToolkitTone
  icon: ReactNode
}

const TONE_CLASSES: Record<
  ToolkitTone,
  {
    icon: string
    accent: string
    shadow: string
  }
> = {
  blue: {
    icon: 'border-blue-500/25 bg-blue-500/10 text-blue-500 dark:text-blue-300',
    accent: 'bg-blue-500',
    shadow: 'hover:shadow-blue-500/10',
  },
  emerald: {
    icon:
      'border-emerald-500/25 bg-emerald-500/10 text-emerald-500 dark:text-emerald-300',
    accent: 'bg-emerald-500',
    shadow: 'hover:shadow-emerald-500/10',
  },
  violet: {
    icon:
      'border-violet-500/25 bg-violet-500/10 text-violet-500 dark:text-violet-300',
    accent: 'bg-violet-500',
    shadow: 'hover:shadow-violet-500/10',
  },
  amber: {
    icon:
      'border-amber-500/25 bg-amber-500/10 text-amber-500 dark:text-amber-300',
    accent: 'bg-amber-500',
    shadow: 'hover:shadow-amber-500/10',
  },
}

export function Toolkit() {
  const { t } = useTranslation()

  const tools: ToolkitItem[] = [
    {
      name: 'CC Switch',
      eyebrow: t('Claude Code 路由切换'),
      description: t('一键切换 Claude Code 供应商与 API 配置，适合多账号和多通道管理。'),
      href: 'https://cc-switch.cc/download',
      tone: 'emerald',
      icon: <Command className='size-5' strokeWidth={1.8} />,
    },
    {
      name: 'Codex++',
      eyebrow: t('Codex 增强工具'),
      description: t('获取 Codex++ 最新版本，扩展本地 Codex 工作流与自动化能力。'),
      href: 'https://github.com/BigPizzaV3/CodexPlusPlus/releases',
      tone: 'violet',
      icon: <TerminalSquare className='size-5' strokeWidth={1.8} />,
    },
    {
      name: 'Codex App',
      eyebrow: t('OpenAI 官方客户端'),
      description: t('前往 OpenAI 官方页面下载 Codex App，连接你的开发环境与云端能力。'),
      href: 'https://openai.com/codex/',
      tone: 'blue',
      icon: <Code2 className='size-5' strokeWidth={1.8} />,
    },
    {
      name: 'Claude Code',
      eyebrow: t('终端 AI 编程助手'),
      description: t('查看官方安装指南，把稳定低价通道接入日常命令行开发流程。'),
      href: 'https://docs.anthropic.com/en/docs/claude-code/overview',
      tone: 'amber',
      icon: <Boxes className='size-5' strokeWidth={1.8} />,
    },
  ]

  return (
    <section className='relative z-10 px-6 pb-20 md:pb-24'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='border-border/50 bg-background/70 overflow-hidden rounded-lg border shadow-[0_24px_70px_-45px_rgba(0,0,0,0.45)] backdrop-blur-xl'>
          <div className='grid gap-px bg-border/45 lg:grid-cols-[0.92fr_1.08fr]'>
            <div className='bg-background p-6 md:p-8'>
              <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-muted/30 px-3 py-1.5 text-[11px] font-medium text-muted-foreground'>
                <Download className='size-3.5' />
                {t('Toolkits')}
              </div>
              <h2 className='max-w-sm text-2xl font-bold tracking-tight md:text-3xl'>
                {t('常用工具，一键前往官方下载')}
              </h2>
              <p className='text-muted-foreground mt-4 max-w-md text-sm leading-relaxed'>
                {t(
                  '从模型接入到本地开发，把常用客户端和命令行工具放在同一个入口。下载工具后替换 Base URL 和密钥即可开始使用。'
                )}
              </p>
              <div className='mt-6 grid grid-cols-3 gap-3'>
                {[
                  [t('低价'), t('0.1 起')],
                  [t('稳定'), t('高可用')],
                  [t('纯血'), t('原生体验')],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className='rounded-lg border border-border/45 bg-muted/20 px-3 py-3'
                  >
                    <div className='text-base font-semibold'>{value}</div>
                    <div className='text-muted-foreground mt-1 text-[11px]'>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-px bg-border/45 sm:grid-cols-2'>
              {tools.map((tool) => {
                const tone = TONE_CLASSES[tool.tone]
                return (
                  <a
                    key={tool.name}
                    href={tool.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`group bg-background p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/20 hover:shadow-xl ${tone.shadow}`}
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div
                        className={`flex size-11 items-center justify-center rounded-lg border ${tone.icon}`}
                      >
                        {tool.icon}
                      </div>
                      <ArrowUpRight className='text-muted-foreground/45 size-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground' />
                    </div>
                    <div className='mt-6'>
                      <div className='text-muted-foreground mb-2 text-[11px] font-medium tracking-[0.14em] uppercase'>
                        {tool.eyebrow}
                      </div>
                      <h3 className='text-base font-semibold'>{tool.name}</h3>
                      <p className='text-muted-foreground mt-2 min-h-[3.25rem] text-sm leading-relaxed'>
                        {tool.description}
                      </p>
                    </div>
                    <div className='mt-5 flex items-center gap-2 text-xs font-medium text-foreground/70'>
                      <span className={`size-1.5 rounded-full ${tone.accent}`} />
                      {t('前往官方入口')}
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
