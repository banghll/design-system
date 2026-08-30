/* 원본(shadcn create)은 아이콘 라이브러리 5종을 URL 파라미터로 바꿔가며 지연 로딩한다.
 * 이 레포는 lucide 하나만 쓰므로, 원본이 지정한 아이콘 이름을 lucide 아이콘으로 옮긴다.
 *
 * 예전에는 전부 네모(SquareIcon)로 떨어뜨렸는데, 화면에 빈 네모가 잔뜩 남아
 * 무엇을 뜻하는 자리인지 읽히지 않았다. 이름이 맞는 것을 찾아 쓰고,
 * 못 찾으면 이름을 해시해 고정된 아이콘 하나를 준다 — 같은 자리는 항상 같은 아이콘이다. */
import {
  Activity,
  ArrowRight,
  Bell,
  Bookmark,
  Box,
  Calendar,
  Check,
  ChevronDown,
  Circle,
  Clock,
  Cloud,
  Code,
  Command,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  Eye,
  File,
  FileText,
  Filter,
  Folder,
  Globe,
  Heart,
  Home,
  Image,
  Info,
  Key,
  Layers,
  Link2,
  Lock,
  Mail,
  Menu,
  MessageSquare,
  Mic,
  Moon,
  MoreHorizontal,
  Music,
  Package,
  Paperclip,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Users,
  Wallet,
  Zap,
} from "lucide-react"

const BY_NAME: Record<string, React.ComponentType<React.ComponentProps<"svg">>> = {
  activity: Activity,
  "arrow-right": ArrowRight,
  bell: Bell,
  bookmark: Bookmark,
  box: Box,
  calendar: Calendar,
  check: Check,
  "chevron-down": ChevronDown,
  circle: Circle,
  clock: Clock,
  cloud: Cloud,
  code: Code,
  command: Command,
  "credit-card": CreditCard,
  database: Database,
  download: Download,
  "external-link": ExternalLink,
  eye: Eye,
  file: File,
  "file-text": FileText,
  filter: Filter,
  folder: Folder,
  globe: Globe,
  heart: Heart,
  home: Home,
  image: Image,
  info: Info,
  key: Key,
  layers: Layers,
  link: Link2,
  lock: Lock,
  mail: Mail,
  menu: Menu,
  message: MessageSquare,
  mic: Mic,
  moon: Moon,
  more: MoreHorizontal,
  music: Music,
  package: Package,
  paperclip: Paperclip,
  pencil: Pencil,
  play: Play,
  plus: Plus,
  refresh: RefreshCw,
  search: Search,
  send: Send,
  settings: Settings,
  share: Share2,
  shield: Shield,
  cart: ShoppingCart,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  trash: Trash2,
  trending: TrendingUp,
  upload: Upload,
  user: User,
  users: Users,
  wallet: Wallet,
  zap: Zap,
}

const POOL = Object.values(BY_NAME)

/* 원본은 라이브러리별 아이콘 이름을 각각의 prop 으로 넘긴다(lucide="star" 등).
 * 그 중 아무거나 집어 이름으로 쓴다. */
type Props = React.ComponentProps<"svg"> & Record<string, unknown>

export function IconPlaceholder({ lucide, ...props }: Props) {
  const raw =
    typeof lucide === "string"
      ? lucide
      : String(
          Object.values(props).find((v) => typeof v === "string" && /^[a-z-]+$/.test(v)) ??
            ""
        )

  const key = raw.toLowerCase()
  const exact = BY_NAME[key]
  if (exact) {
    const Icon = exact
    return <Icon {...(props as React.ComponentProps<"svg">)} />
  }

  /* 못 찾으면 이름을 해시해 고정 배정 — 새로고침해도 같은 아이콘이 나온다. */
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  const Icon = POOL[h % POOL.length]
  return <Icon {...(props as React.ComponentProps<"svg">)} />
}
