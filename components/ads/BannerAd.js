"use client";

import Script from "next/script";

export default function BannerAd() {
  return (
    <>
      <Script id="hilltop-banner" strategy="afterInteractive">
        {`
          (function(jbm){
            var d = document,
                s = d.createElement('script'),
                l = d.scripts[d.scripts.length - 1];
            s.settings = jbm || {};
            s.src = "//quarrelsomebitter.com/byX/VMsYd.GHli0nYnWjcH/uefmw9/ufZ-U/lrkRPGTjcDy/MjjGY/wcNbTYc/tPN/zBI-yZNVjzA-2/MIQe";
            s.async = true;
            s.referrerPolicy = "no-referrer-when-downgrade";
            l.parentNode.insertBefore(s, l);
          })({});
        `}
      </Script>
    </>
  );
}