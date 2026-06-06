/*
Copyright (C) 2025 QuantumNous

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

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconPlay,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import { Claude, OpenAI } from '@lobehub/icons';

const { Text } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');
  const valueHighlights = [
    { value: '0.1', label: t('低至 0.1 兑换 $1 额度') },
    { value: 'Stable', label: t('高速稳定低延迟') },
    { value: 'Pure', label: t('纯血模型直连体验') },
  ];
  const toolkitItems = [
    {
      name: 'CC Switch',
      mark: 'CC',
      tag: t('Claude Code 路由切换'),
      description: t('一键切换 Claude Code 供应商与 API 配置，适合多通道管理。'),
      href: 'https://cc-switch.cc/download',
      accent: 'teal',
    },
    {
      name: 'Codex++',
      mark: 'C++',
      tag: t('Codex 增强工具'),
      description: t('获取 Codex++ 最新版本，扩展本地 Codex 工作流。'),
      href: 'https://github.com/BigPizzaV3/CodexPlusPlus/releases',
      accent: 'violet',
    },
    {
      name: 'Codex App',
      mark: 'CA',
      tag: t('OpenAI 官方客户端'),
      description: t('前往 OpenAI 官方页面下载 Codex App，连接你的开发环境。'),
      href: 'https://openai.com/codex/',
      accent: 'blue',
    },
  ];

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  return (
    <div className='classic-page-fill classic-home-page w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='classic-home-default w-full overflow-x-hidden'>
          <div className='classic-home-hero w-full relative overflow-hidden'>
            <div className='classic-home-grid' />
            <div className='classic-home-hero-inner'>
              <section className='classic-home-copy'>
                <div className='classic-home-eyebrow'>
                  <span className='classic-home-eyebrow-dot' />
                  {t('高性价比纯血模型通道')}
                </div>
                <h1 className='classic-home-title'>openapi</h1>
                <p className='classic-home-subtitle'>
                  {t('专注 GPT 与 Claude Code 工作流，一个 Base URL 即可接入。低成本、高稳定、响应快，适合长期高频使用。')}
                </p>
                <div className='classic-home-highlights'>
                  {valueHighlights.map((item) => (
                    <div className='classic-home-highlight' key={item.label}>
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className='classic-home-endpoint-shell'>
                  <div className='classic-home-endpoint-label'>Base URL</div>
                  <Input
                    readonly
                    value={serverAddress}
                    className='classic-home-endpoint-input'
                    size={isMobile ? 'default' : 'large'}
                    suffix={
                      <div className='classic-home-endpoint-suffix'>
                        <ScrollList
                          bodyHeight={32}
                          style={{ border: 'unset', boxShadow: 'unset' }}
                        >
                          <ScrollItem
                            mode='wheel'
                            cycled={true}
                            list={endpointItems}
                            selectedIndex={endpointIndex}
                            onSelect={({ index }) => setEndpointIndex(index)}
                          />
                        </ScrollList>
                        <Button
                          type='primary'
                          onClick={handleCopyBaseURL}
                          icon={<IconCopy />}
                          className='classic-home-copy-button'
                        />
                      </div>
                    }
                  />
                </div>
                <div className='classic-home-actions'>
                  <Link to='/console'>
                    <Button
                      theme='solid'
                      type='primary'
                      size={isMobile ? 'default' : 'large'}
                      className='classic-home-primary-action'
                      icon={<IconPlay />}
                    >
                      {t('获取密钥')}
                    </Button>
                  </Link>
                </div>
                <div className='classic-home-metrics'>
                  <div>
                    <strong>0.1</strong>
                    <span>{t('低价额度')}</span>
                  </div>
                  <div>
                    <strong>1</strong>
                    <span>Base URL</span>
                  </div>
                  <div>
                    <strong>GPT</strong>
                    <span>Claude Code</span>
                  </div>
                </div>
              </section>

              <section className='classic-home-visual' aria-hidden='true'>
                <div className='classic-home-orbit-panel'>
                  <div className='classic-home-panel-header'>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className='classic-home-terminal-line'>
                    <span>POST</span>
                    <code>/v1/chat/completions</code>
                  </div>
                  <div className='classic-home-terminal-line'>
                    <span>POST</span>
                    <code>/v1/responses</code>
                  </div>
                  <div className='classic-home-terminal-line'>
                    <span>POST</span>
                    <code>/v1/messages</code>
                  </div>
                  <div className='classic-home-route-map'>
                    <div>GPT</div>
                    <span />
                    <div>openapi</div>
                    <span />
                    <div>Claude Code</div>
                  </div>
                </div>
              </section>
            </div>

            <div className='classic-home-provider-strip'>
              <div className='classic-home-model-card'>
                <Text className='classic-home-provider-title'>
                  {t('当前支持')}
                </Text>
                <div className='classic-home-provider-grid'>
                  <div className='classic-home-model-pill'>
                    <OpenAI size={28} />
                    <span>GPT</span>
                  </div>
                  <div className='classic-home-model-pill'>
                    <Claude.Color size={28} />
                    <span>Claude Code</span>
                  </div>
                </div>
              </div>

              <div className='classic-home-toolkit-card'>
                <div>
                  <Text className='classic-home-provider-title'>
                    {t('工具包')}
                  </Text>
                  <h2>{t('常用工具，一键前往官方下载')}</h2>
                  <p>
                    {t('下载工具后替换 Base URL 和密钥，即可接入 openapi。')}
                  </p>
                </div>
                <div className='classic-home-toolkit-grid'>
                  {toolkitItems.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.href}
                      target='_blank'
                      rel='noreferrer'
                      className={`classic-home-toolkit-item classic-home-toolkit-${tool.accent}`}
                    >
                      <div className='classic-home-toolkit-mark'>
                        {tool.mark}
                      </div>
                      <div>
                        <strong>{tool.name}</strong>
                        <span>{tool.tag}</span>
                        <p>{tool.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='classic-page-fill overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-full border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
