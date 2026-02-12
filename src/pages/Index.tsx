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
    if (isAlwaysOnTop) {
      document.body.style.pointerEvents = 'none';
      const card = document.getElementById('control-card');
      if (card) {
        card.style.pointerEvents = 'auto';
      }
    } else {
      document.body.style.pointerEvents = 'auto';
    }
  }, [isAlwaysOnTop]);

  const requestAlwaysOnTop = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsAlwaysOnTop(true);
      toast.success('Режим поверх окон активирован!', {
        description: 'Нажмите ESC для выхода из полноэкранного режима'
      });
    } catch (err) {
      toast.info('Полноэкранный режим', {
        description: 'Используйте F11 для активации полноэкранного режима'
      });
    }
  };

  const exitAlwaysOnTop = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsAlwaysOnTop(false);
    toast.info('Обычный режим', {
      description: 'Режим поверх окон отключен'
    });
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

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <Card 
          id="control-card"
          className="w-full max-w-2xl bg-card/80 backdrop-blur-xl border-2 p-8 space-y-8"
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

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Icon name="Info" size={18} className="mt-0.5 flex-shrink-0" />
              <p>
                Режим «поверх окон» активирует полноэкранный режим с медиа-оверлеем. 
                Работает поверх вкладок браузера. Для работы поверх всех приложений ПК используйте F11 и расширения браузера.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}