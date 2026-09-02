(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,355799,e=>{"use strict";var s=e.i(843476),t=e.i(670097),r=e.i(871147),a=e.i(720622),n=e.i(465078),o=e.i(815731),i=e.i(970065),l=e.i(694689),c=e.i(298966),h=e.i(816186),d=e.i(93306),p=e.i(950216),u=e.i(471075);let m=(0,r.createChat)().user("Hello there!").sleep(2e3).assistant("Hey, how's it going?").user(`I'm prototyping an AI chat surface for our product docs.

Can you sketch a sensible component breakdown and call out anything I'd regret baking into v1?`).sleep(2e3).assistant(`## Recommended layout

Treat the chat as three layers so scrolling and the composer never fight each other:

| Layer | Responsibility |
| --- | --- |
| **Shell** | Card or page frame, title, status indicator |
| **Transcript** | \`overflow-y-auto\` message list |
| **Composer** | Input group, send, stop |

### Message rendering

- **User messages**: right-aligned, muted background, \`max-w-[80%]\`.
- **Assistant messages**: full width within the column; use \`whitespace-pre-wrap\` for text.

### Suggested component split

\`\`\`tsx
<ChatCard>
  <ChatHeader status={status} />
  <ChatTranscript messages={messages} />
  <ChatComposer onSubmit={sendMessage} onStop={stop} />
</ChatCard>
\`\`\`

### v1 pitfalls to avoid

1. **Inlining transport logic in the UI** — keep scripted/demo transport beside your example, not inside shared components.
2. **Fixed transcript height without \`overflow-hidden\`** — parent must clip, child must scroll, or the composer jumps.
3. **Not giving the scroller a ref or auto-scroll flag** — long replies should stay pinned to the bottom unless the user scrolls up.

### Practical next step

Start with plain \`whitespace-pre-wrap\` text to validate spacing and scroll behavior. Once the transcript feels right, you can swap assistant text rendering to a richer renderer if you need it.

Want me to walk through auto-scroll vs. manual scroll-to-bottom next?`).user("What about message spacing when one reply is short and the next is really long?").sleep(2e3).assistant("Good question. The scroll container should own vertical rhythm, not individual bubbles.\n\nUse a consistent `gap` on the message list (something like `gap-4` or `gap-6`) so short and long messages sit on the same grid. For assistant replies that span many paragraphs, keep everything in one bubble rather than splitting on every line break — otherwise the transcript feels choppy when you're skimming.\n\nWhen a long reply streams in, pin the viewport to the bottom with `MessageScroller autoScroll` until the user scrolls up. If they've scrolled away, show a scroll-to-bottom affordance instead of yanking them back mid-read.\n\nThat's usually enough for v1. Fancy diff animations or per-paragraph fade-ins can wait until you've validated that the base scroll + composer layout holds up on real devices.").user("Thanks, that helps.").sleep(1e3).assistant("Happy to help — send another message when you're ready to keep stepping through the demo."),g=m.get(0),x=m.transport({delayMs:10});function y(){let{messages:e,sendMessage:r,status:y,stop:b}=(0,t.useChat)({messages:g,transport:x}),f=m.next(e),w="submitted"===y||"streaming"===y;return(0,s.jsx)(n.Example,{title:"Chat",containerClassName:"self-start",children:(0,s.jsxs)(i.Card,{className:"h-140",children:[(0,s.jsxs)(i.CardHeader,{children:[(0,s.jsx)(i.CardTitle,{children:"How can I help you today?"}),(0,s.jsxs)(i.CardDescription,{children:["Status: ",y]})]}),(0,s.jsx)(i.CardContent,{className:"min-h-0 flex-1 overflow-hidden p-0",children:(0,s.jsx)(d.MessageScrollerProvider,{children:(0,s.jsxs)(d.MessageScroller,{children:[(0,s.jsx)(d.MessageScrollerViewport,{children:(0,s.jsxs)(d.MessageScrollerContent,{className:"p-(--card-spacing)",children:[e.map(e=>(0,s.jsx)(d.MessageScrollerItem,{messageId:e.id,scrollAnchor:"user"===e.role,children:(0,s.jsx)(h.Message,{align:"user"===e.role?"end":"start",children:(0,s.jsx)(h.MessageContent,{children:e.parts.map((t,r)=>"text"!==t.type?null:(0,s.jsx)(o.Bubble,{variant:"user"===e.role?"default":"muted",children:(0,s.jsx)(o.BubbleContent,{className:"whitespace-pre-wrap",children:t.text})},`${e.id}-${r}`))})})},e.id)),"submitted"===y?(0,s.jsx)(d.MessageScrollerItem,{scrollAnchor:!1,children:(0,s.jsxs)(c.Marker,{role:"status",children:[(0,s.jsx)(c.MarkerIcon,{children:(0,s.jsx)(p.Spinner,{})}),(0,s.jsx)(c.MarkerContent,{children:"Thinking..."})]})}):null]})}),(0,s.jsx)(d.MessageScrollerButton,{})]})})}),(0,s.jsx)(i.CardFooter,{children:(0,s.jsx)("form",{onSubmit:function(e){e.preventDefault(),f&&!w&&r(f)},className:"w-full",id:"chat-form",children:(0,s.jsxs)(l.InputGroup,{children:[(0,s.jsx)(l.InputGroupTextarea,{placeholder:"Ask me anything...",className:"h-10 min-h-10 overflow-y-auto",value:w?"":f?(0,a.getMessageText)(f):"",readOnly:!0}),(0,s.jsxs)(l.InputGroupAddon,{align:"block-end",className:"p-2",children:[(0,s.jsxs)(l.InputGroupButton,{variant:"default",size:"icon-sm",type:"submit",disabled:!f||w,className:"ml-auto data-[hidden=true]:hidden","data-hidden":w,children:[(0,s.jsx)(u.IconPlaceholder,{lucide:"ArrowUpIcon",tabler:"IconArrowUp",hugeicons:"ArrowUp02Icon",phosphor:"ArrowUpIcon",remixicon:"RiArrowUpLine"}),(0,s.jsx)("span",{className:"sr-only",children:"Send"})]}),(0,s.jsxs)(l.InputGroupButton,{size:"icon-sm",type:"button","data-hidden":!w,className:"ml-auto data-[hidden=true]:hidden",onClick:()=>b(),children:[(0,s.jsx)(u.IconPlaceholder,{lucide:"StopCircleIcon",tabler:"IconPlayerStop",hugeicons:"StopCircleIcon",phosphor:"StopCircleIcon",remixicon:"RiStopCircleLine"}),(0,s.jsx)("span",{className:"sr-only",children:"Stop"})]})]})]})})})]})})}e.s(["default",0,function(){return(0,s.jsx)(n.ExampleWrapper,{children:(0,s.jsx)(y,{})})}])},676515,function(e){e.n(e.i(355799))}]);