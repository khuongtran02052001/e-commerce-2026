import { cn } from '@/lib/utils';
import { Facebook, Github, Linkedin, Slack, Youtube } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const socialLink = [
  {
    title: 'Youtube',
    href: '#',
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: 'Github',
    href: '#',
    icon: <Github className="w-5 h-5" />,
  },
  {
    title: 'Linkedin',
    href: '#',
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    title: 'Facebook',
    href: '#',
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: 'Slack',
    href: '#',
    icon: <Slack className="w-5 h-5" />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-3.5 text-shop_dark_green/70', className)}>
        {socialLink.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'rounded-full border border-shop_light_green/20 bg-white/75 p-2 hover:border-shop_light_green/35 hover:bg-shop_light_pink/75 hover:text-shop_dark_green hoverEffect',
                  iconClassName,
                )}
              >
                {item.icon}
              </a>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                'border border-shop_light_green/20 bg-white text-dark-color font-semibold shadow-sm',
                tooltipClassName,
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
