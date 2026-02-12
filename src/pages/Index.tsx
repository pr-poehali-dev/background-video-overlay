import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export default function Index() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [opacity, setOpacity] = useState([50]);
  const [neonColor, setNeonColor] = useState('#0EA5E9');
  const [animationSpeed, setAnimationSpeed] = useState([6]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      toast.success('Видео загружено!', {
        description: 'Теперь оно будет плавать на фоне'
      });
    } else {
      toast.error('Выберите видео файл');
    }
  };

  const requestScreenPermission = async () => {
    toast.info('Полноэкранный режим', {
      description: 'Для работы поверх экрана используйте F11 или разверните окно браузера'
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
      {videoUrl && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 floating"
          style={{
            opacity: opacity[0] / 100,
            animationDuration: `${animationSpeed[0]}s`
          }}
        >
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-xl border-2 p-8 space-y-8"
          style={{
            borderColor: neonColor,
            boxShadow: `0 0 20px ${neonColor}40, 0 0 40px ${neonColor}20`
          }}
        >
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold neon-text" style={{ color: neonColor }}>
              ScreenFloat
            </h1>
            <p className="text-foreground/70">Видео-оверлей для вашего рабочего стола</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: neonColor }}>
                <Icon name="Upload" size={18} />
                Загрузка видео
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
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
                <Icon name="Video" size={20} className="mr-2" />
                {videoUrl ? 'Изменить видео' : 'Выбрать видео'}
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

            <Button
              onClick={requestScreenPermission}
              className="w-full neon-glow transition-all"
              variant="outline"
              style={{
                borderColor: neonColor,
                color: neonColor
              }}
            >
              <Icon name="Monitor" size={20} className="mr-2" />
              Включить полноэкранный режим
            </Button>
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Icon name="Info" size={18} className="mt-0.5 flex-shrink-0" />
              <p>
                Нажмите F11 для полноэкранного режима. Оверлей будет работать поверх других окон браузера.
                Для работы поверх всех приложений ПК используйте расширения браузера для постоянных окон.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
