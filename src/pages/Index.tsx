import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export default function Index() {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null);
  const [opacity, setOpacity] = useState([50]);
  const [neonColor, setNeonColor] = useState('#0EA5E9');
  const [animationSpeed, setAnimationSpeed] = useState([6]);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('video/')) {
        setMediaUrl(url);
        setMediaType('video');
        toast.success('Видео загружено!', {
          description: 'Теперь оно будет плавать на фоне'
        });
      } else if (file.type.startsWith('image/')) {
        setMediaUrl(url);
        setMediaType('image');
        toast.success('Изображение загружено!', {
          description: 'Теперь оно будет плавать на фоне'
        });
      } else {
        toast.error('Выберите видео или изображение');
      }
    }
  };

  useEffect(() => {
    if (isAlwaysOnTop && isMenuHidden) {
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.pointerEvents = 'auto';
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsAlwaysOnTop(false);
        setIsMenuHidden(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isAlwaysOnTop, isMenuHidden]);

  const requestPermission = async () => {
    try {
      const notificationPermission = await Notification.requestPermission();
      
      await document.documentElement.requestFullscreen({
        navigationUI: 'hide'
      });

      if ('wakeLock' in navigator) {
        try {
          const nav = navigator as { wakeLock?: { request: (type: string) => Promise<unknown> } };
          await nav.wakeLock?.request('screen');
          toast.success('Полный доступ получен!', {
            description: 'Оверлей может работать поверх всех окон. Уведомления включены.'
          });
        } catch (e) {
          toast.success('Разрешения получены', {
            description: 'Режим оверлея активирован'
          });
        }
      }
      
      setHasPermission(true);
      setIsAlwaysOnTop(true);
    } catch (err) {
      toast.info('Разрешите доступ', {
        description: 'Нажмите "Разрешить" в запросе браузера для работы поверх окон'
      });
      setHasPermission(true);
    }
  };

  const requestAlwaysOnTop = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsAlwaysOnTop(true);
      toast.success('Режим поверх окон активирован!', {
        description: 'Скройте меню для полного погружения. ESC для выхода'
      });
    } catch (err) {
      toast.info('Полноэкранный режим', {
        description: 'Используйте F11 или кнопку разрешить доступ'
      });
    }
  };

  const exitAlwaysOnTop = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsAlwaysOnTop(false);
    setIsMenuHidden(false);
    toast.info('Обычный режим', {
      description: 'Режим поверх окон отключен'
    });
  };

  const toggleMenu = () => {
    setIsMenuHidden(!isMenuHidden);
    if (!isMenuHidden) {
      toast.success('Меню скрыто', {
        description: 'Нажмите на кружок в углу для открытия'
      });
    }
  };

  const neonColors = [
    { name: 'Синий', value: '#0EA5E9' },
    { name: 'Пурпурный', value: '#D946EF' },
    { name: 'Оранжевый', value: '#F97316' },
    { name: 'Зелёный', value: '#10B981' },
    { name: 'Розовый', value: '#EC4899' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {mediaUrl && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 floating"
          style={{
            opacity: opacity[0] / 100,
            animationDuration: `${animationSpeed[0]}s`
          }}
        >
          {mediaType === 'video' ? (
            <video
              src={mediaUrl}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Background"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {isMenuHidden && (
        <button
          onClick={toggleMenu}
          className="fixed top-6 right-6 z-50 w-16 h-16 rounded-full neon-glow transition-all hover:scale-110 flex items-center justify-center"
          style={{
            backgroundColor: neonColor,
            boxShadow: `0 0 30px ${neonColor}, 0 0 60px ${neonColor}80`
          }}
        >
          <Icon name="Settings" size={28} className="text-black" />
        </button>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <Card 
          id="control-card"
          className={`w-full max-w-2xl bg-card/80 backdrop-blur-xl border-2 p-8 space-y-8 transition-all duration-500 ${
            isMenuHidden ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'
          }`}
          style={{
            borderColor: neonColor,
            boxShadow: `0 0 20px ${neonColor}40, 0 0 40px ${neonColor}20`
          }}
        >
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold neon-text" style={{ color: neonColor }}>
              ScreenFloat
            </h1>
            <p className="text-foreground/70">Медиа-оверлей для вашего рабочего стола</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: neonColor }}>
                <Icon name="Upload" size={18} />
                Загрузка медиа (видео или фото)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full neon-glow transition-all"
                style={{
                  backgroundColor: neonColor,
                  color: '#000'
                }}
              >
                <Icon name="ImagePlay" size={20} className="mr-2" />
                {mediaUrl ? 'Изменить медиа' : 'Выбрать видео или фото'}
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: neonColor }}>
                <Icon name="Droplets" size={18} />
                Прозрачность фона: {opacity[0]}%
              </label>
              <Slider
                value={opacity}
                onValueChange={setOpacity}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: neonColor }}>
                <Icon name="Palette" size={18} />
                Цвет неонового свечения
              </label>
              <div className="flex gap-3 flex-wrap">
                {neonColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNeonColor(color.value)}
                    className="w-16 h-16 rounded-lg transition-all border-2"
                    style={{
                      backgroundColor: color.value,
                      borderColor: neonColor === color.value ? '#fff' : 'transparent',
                      boxShadow: neonColor === color.value ? `0 0 20px ${color.value}` : 'none'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: neonColor }}>
                <Icon name="Gauge" size={18} />
                Скорость анимации: {animationSpeed[0]}s
              </label>
              <Slider
                value={animationSpeed}
                onValueChange={setAnimationSpeed}
                min={2}
                max={15}
                step={1}
                className="w-full"
              />
            </div>

            {!hasPermission ? (
              <div className="space-y-4">
                <Button
                  onClick={requestPermission}
                  className="w-full neon-glow transition-all h-14 text-lg"
                  style={{
                    backgroundColor: neonColor,
                    color: '#000'
                  }}
                >
                  <Icon name="ShieldCheck" size={24} className="mr-2" />
                  Запросить доступ к работе поверх окон
                </Button>
                <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
                    <p>Система запросит разрешения на уведомления и полноэкранный режим для работы оверлея поверх всех приложений</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {!isAlwaysOnTop ? (
                  <Button
                    onClick={requestAlwaysOnTop}
                    className="w-full neon-glow transition-all"
                    variant="outline"
                    style={{
                      borderColor: neonColor,
                      color: neonColor
                    }}
                  >
                    <Icon name="Layers" size={20} className="mr-2" />
                    Активировать режим поверх окон
                  </Button>
                ) : (
                  <Button
                    onClick={exitAlwaysOnTop}
                    className="w-full neon-glow transition-all"
                    variant="outline"
                    style={{
                      borderColor: '#F97316',
                      color: '#F97316'
                    }}
                  >
                    <Icon name="X" size={20} className="mr-2" />
                    Выключить режим поверх окон
                  </Button>
                )}
              </div>
            )}
          </div>

          {isAlwaysOnTop && (
            <div className="pt-4 border-t border-border/50">
              <Button
                onClick={toggleMenu}
                className="w-full neon-glow transition-all h-12"
                style={{
                  backgroundColor: neonColor,
                  color: '#000'
                }}
              >
                <Icon name="EyeOff" size={20} className="mr-2" />
                Скрыть меню настроек
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Icon name="Info" size={18} className="mt-0.5 flex-shrink-0" />
              <p>
                Запрос разрешений активирует полноэкранный режим, уведомления и блокировку сна для стабильной работы оверлея поверх всех приложений ПК и телефона.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}