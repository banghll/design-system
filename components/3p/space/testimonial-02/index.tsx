// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import BrandSlider, { BrandList } from "./brand-slider";
import Testimonial01Inner, { Testimonial } from "./testimonial";

const brandList: BrandList[] = [
    {
        image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-1.svg",
        lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-white-1.svg",
        name: "Brand 1",
    },
    {
        image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-2.svg",
        lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-white-2.svg",
        name: "Brand 2",
    },
    {
        image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-3.svg",
        lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-white-3.svg",
        name: "Brand 3",
    },
    {
        image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-4.svg",
        lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-white-4.svg",
        name: "Brand 4",
    },
    {
        image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-5.svg",
        lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-muted-white-5.svg",
        name: "Brand 5",
    },
];

const defaultTestimonials: Testimonial[] = [
    {
        quote: "Shadcn Space replaced messy UI kits and half-baked templates. Today our dashboards look premium, scale beautifully, and our team focuses on real features instead of design debt.",
        author: "Walter Dutcher",
        role: "CEO",
        image: "https://images.shadcnspace.com/assets/profiles/testimonial-user.png",
    },
    {
        quote: "Shadcn Space replaced messy UI kits and half-baked templates. Today our dashboards look premium, scale beautifully, and our team focuses on real features instead of design debt.",
        author: "Errica Mcdowell",
        role: "Marketing Head",
        image: "https://images.shadcnspace.com/assets/profiles/testimonial-user-2.png",
    },
];

export default function Testimonial01() {
    return (
        <main>
            <Testimonial01Inner testimonials={defaultTestimonials} />
            <BrandSlider brandList={brandList} />
        </main>
    );
}