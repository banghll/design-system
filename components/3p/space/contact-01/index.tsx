// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import ContactInfo from "./contact-info";
import ContactForm from "./contact-form";

const Contact = () => {
  return (
    <section className="py-10 md:py-20">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="grid grid-cols-12 content-center justify-between gap-6 sm:gap-8 md:gap-0">
          <div className="w-full col-span-12 md:col-span-6">
            <ContactInfo />
          </div>
          <div className="col-span-1"></div>
          <div className="w-full col-span-12 md:col-span-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
