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
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';

const { Text } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

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
                  {t('统一的大模型接口网关')}
                </div>
                <h1 className='classic-home-title'>openapi</h1>
                <p className='classic-home-subtitle'>
                  {t('多模型统一接入，只需将基址替换为：')}
                </p>
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
                  {isDemoSiteMode && statusState?.status?.version ? (
                    <Button
                      size={isMobile ? 'default' : 'large'}
                      className='classic-home-secondary-action'
                      icon={<IconGithubLogo />}
                      onClick={() =>
                        window.open(
                          'https://github.com/QuantumNous/new-api',
                          '_blank',
                        )
                      }
                    >
                      {statusState.status.version}
                    </Button>
                  ) : (
                    docsLink && (
                      <Button
                        size={isMobile ? 'default' : 'large'}
                        className='classic-home-secondary-action'
                        icon={<IconFile />}
                        onClick={() => window.open(docsLink, '_blank')}
                      >
                        {t('文档')}
                      </Button>
                    )
                  )}
                </div>
                <div className='classic-home-metrics'>
                  <div>
                    <strong>30+</strong>
                    <span>{t('供应商')}</span>
                  </div>
                  <div>
                    <strong>1</strong>
                    <span>Base URL</span>
                  </div>
                  <div>
                    <strong>API</strong>
                    <span>{t('统一接入')}</span>
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
                    <code>/v1/audio/transcriptions</code>
                  </div>
                  <div className='classic-home-route-map'>
                    <div>openapi</div>
                    <span />
                    <div>模型路由</div>
                    <span />
                    <div>统一计费</div>
                  </div>
                </div>
              </section>
            </div>

            <div className='classic-home-provider-strip'>
              <Text className='classic-home-provider-title'>
                {t('支持众多的大模型供应商')}
              </Text>
              <div className='classic-home-provider-grid'>
                <Moonshot size={34} />
                <OpenAI size={34} />
                <XAI size={34} />
                <Zhipu.Color size={34} />
                <Volcengine.Color size={34} />
                <Cohere.Color size={34} />
                <Claude.Color size={34} />
                <Gemini.Color size={34} />
                <Suno size={34} />
                <Minimax.Color size={34} />
                <Wenxin.Color size={34} />
                <Spark.Color size={34} />
                <Qingyan.Color size={34} />
                <DeepSeek.Color size={34} />
                <Qwen.Color size={34} />
                <Midjourney size={34} />
                <Grok size={34} />
                <AzureAI.Color size={34} />
                <Hunyuan.Color size={34} />
                <Xinference.Color size={34} />
                <Typography.Text className='classic-home-provider-more'>
                  30+
                </Typography.Text>
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
