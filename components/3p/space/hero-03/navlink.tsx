// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { cn } from "@/lib/utils";

export type NavLinkItem = {
  title: string;
  href: string;
  isActive?: boolean;
};

export interface NavLinkProps {
  item: NavLinkItem;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, }) => {
  const { title, href, isActive } = item;

  return (
    <li className={cn(`group flex items-center transition-all duration-500 ease-in-out w-fit`,
      isActive ? "gap-3" : "gap-0 hover:gap-3"
    )}>
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isActive ? "max-w-6 opacity-100" : "max-w-0 opacity-0 group-hover:max-w-6 group-hover:opacity-100",
        )}
      >
        <img
          src="https://images.shadcnspace.com/assets/svgs/primary-leaf.svg"
          alt="icon"
          height={20}
          width={20}
          className="animate-spin"
        />
      </div>
      <a
        href={href}
        className="text-foreground text-2xl sm:text-4xl sm:leading-10 leading-8 font-semibold"
      >
        {title}
      </a>
    </li>
  );
};

export default NavLink;
