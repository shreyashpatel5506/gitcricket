"use client";

import Script from "next/script";

export default function InPageAd() {
  return (
    <>
      <Script id="hilltop-inpage" strategy="afterInteractive">
        {`
          (function(zchkt){
            var d = document,
                s = d.createElement('script'),
                l = d.scripts[d.scripts.length - 1];
            s.settings = zchkt || {};
            s.src = "//quarrelsomebitter.com/b.X/VGsTdiGLlR0HYEW-cT/UeTm_9vuPZVUMlpkjPRTOcoyjM/jiYjwHOUD/E/t/NlzXI/yzN/jfAO4zNRQS";
            s.async = true;
            s.referrerPolicy = "no-referrer-when-downgrade";
            l.parentNode.insertBefore(s, l);
          })({});
        `}
      </Script>
    </>
  );
}