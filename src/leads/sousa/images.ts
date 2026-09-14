import type { ImageRef } from "@/factory/types";

/**
 * SOUSA campaign imagery — a cohesive editorial set generated for this demo.
 * `origin: "generated"` is not decoration: it is what stops any caption or alt
 * text from claiming these show the real salon, its staff or its clients.
 *
 * Signed CDN URLs (see next.config.ts remotePatterns for the allowed hosts).
 */
export const sousaImages: Record<string, ImageRef> = {
  heroBg: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__3/-t-e-x-t_-t-o_-i-m-a-g-e-204e41e2-c7a1-4876-8c03-0ad462003f71.png?Expires=2104342215&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=Kd5FGeL~SvGBwNvnKvgkOpI5g36Hja4OVbybWt1hjBpQWdL9-3p5LLaQwbsolqDrHtPWzmFWN870TKHYCw98iyqzjQI-~6yj5z3mt2gsKyQImJHNH89dUm2dDGdSwambNf0WbTX~ztkIDXB9QPqOX8OV4ezD2fWn8iaqFpS0xLIaVFKNgZkOMGRvJWatKDD2JxhOJJMzt9XxYfd38oExO5a66z3tfKpSFBZXMm9xSV6iZbiwG6dGcUp6XT9edhyriWa39NXOF94aS4XpOd0LIPhbJsiRvT3gWpQ3IaSUEGVNXXxVnEUeINixirxnsT3oIjGeNCbrId-hLGFs9QGXsg__",
    width: 1280,
    height: 720,
    origin: "generated",
    focus: "50% 40%",
    alt: {
      es: "Melena morena en movimiento sobre un fondo casi negro",
      en: "Dark brunette hair caught in motion against a near-black background",
    },
  },
  brandBg: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__8/-t-e-x-t_-t-o_-i-m-a-g-e-183a5cb6-93e0-44d5-ae58-118c1ef9b596.png?Expires=2104342215&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=i7qvjjhj6jjk6cl1WiKC5DP~b6zWGSQ0G2pKu8PjuEUvQ8hLOPdcErWjc7T8dS7mEsRwcj8aaDCm7ku0KrkdRMBu3WAtK8J~hqxvzcDEDO6joTM5wpphWh042QV6bvyq7716sxqNxPHuO3ndrSLxy0DIGTysB-mywM7sLbx3aREo6IUsrfUhCLFvArnO2Gnlaqnn6lJJ~c8v1ikSYmzDMbTPnEqsniYpqdL-widhxygOykrkzdDy7w4lLcX8paQc-khknxY9-BaPzDuy9LZ94yi~HQfSX2u6B28VSNOEfal3LKzTvetR1pvsbZZTIIXYTLldxwvya59XFCGq9d-stA__",
    width: 1280,
    height: 720,
    origin: "generated",
    alt: {
      es: "Macro extremo de la textura de un cabello castaño oscuro",
      en: "Extreme close-up macro texture of dark brunette hair strands",
    },
  },
  strandBrunette: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__6/-t-e-x-t_-t-o_-i-m-a-g-e-50fc0e59-d519-4921-9f82-52d2a79362a1.png?Expires=2104342215&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=JrNNB1~l2uNzybPuUHaGU9tkknGH9BMjIE5H0j2yXN4yFcd50B~fuxiwvhtITBZl1MLtHNoYlj9qyr~3XSLUQzluY9wYmceYZjKwfv3JepmifX1kdWGAcIg1oYEnqTuIe~W2Tv-3QmXOnrikxnFyYJkrWFIBX6esmuAZLcrYEd~p60tH7aNtQrCwsA76WeVniK1OR71JZezU~Kz3-236iZoSBOK~q2OiaeuZtcYU2o0rW4MtqZmNUDv4xRpDgZxfv6Wu2ieqvEACxn9qXSeH2z-7QX0hdYA7rnqOIPPgk65itIOjNEkmoSjjsIKKw0CUnswF7irFf6P16QR6gJumKA__",
    width: 1280,
    height: 1280,
    origin: "generated",
    alt: {
      es: "Macro de un mechón de cabello castaño oscuro",
      en: "Macro photograph of a silky flowing lock of dark brunette hair",
    },
  },
  strandCopper: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__1/-t-e-x-t_-t-o_-i-m-a-g-e-a29e4034-533e-4504-8d2c-3c6a23f7456a.png?Expires=2104342215&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=1LA~orTR~3j7bpFmrdt2v4u1mllcfdgWhPfDJK~p0McFila1FohqdqmKrJKyrufsEeULzmwqDaJV589m2fVWKm05ajI5uk5J8mNymv-KfcYN4ytmEuEfu62dBTiB7USqs60lkAXhA~RJPNSDUXnqlN8HshFc-YIDK5dd5-ZHSwvQNLRsquUwYzOey-marQoGMVhWAUOn3mx5M8m5yzBEbc-zkoAqT-dOKB0Rre4bUGShSrrmaav7sUGT1FBU3db3UD7dY7eAejyOgCFHlPywtmkeOzrArgHNESjjlytq932xyJG3A~dJ1gQbf92BGAB-zQ9Dd~6jNJ5ZeCrgV2OTMQ__",
    width: 1280,
    height: 1280,
    origin: "generated",
    alt: {
      es: "Macro de un mechón de cabello cobrizo",
      en: "Macro photograph of a silky flowing lock of copper auburn hair",
    },
  },
  strandBlonde: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__6/-t-e-x-t_-t-o_-i-m-a-g-e-480cdb6c-9df5-4629-9322-f295ea66ff28.png?Expires=2104342215&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=thlcP73zCC6qTDgQOqex3P8d8MotTlWZXzGUBAiK-H01zMhN2P8QiaWTJXlEvUhVA7xwUk7~l~VIcRwqQ4RBC3jAgTk3PSq6ahHua92L-t~HjalIQgiKGVttEAJOuvkJ2mar4YrgFQJCt0Wdr1X~rPrR~UE0uYKrmObMTXJg6GlGyV0XFRcDSz7uguPrk72xql7Kg1UICmqji4~ZLCDHDY6YKiGOZwBNaqOfDiBpYrufALLvWh09NRnQTqwPXyd21eex6N4UZrjkHVNX-xeSJH5N9aTn1HX70jytK1PahpngMikcbj0Ft4Amb3q501p3WhOR8Xnw8Y9UGPpj6zXKlA__",
    width: 1280,
    height: 1280,
    origin: "generated",
    alt: {
      es: "Macro de un mechón de cabello rubio cálido",
      en: "Macro photograph of a silky flowing lock of warm blonde hair",
    },
  },
  scissorsMacro: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__3/-t-e-x-t_-t-o_-i-m-a-g-e-959b9de7-284c-46b2-9292-6d1ba2eb37b4.png?Expires=2104342215&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=BTbh~3taKX4LTnduxxUc4H--lvK0rjYV90S-74yVkMfeUzDbEhu2ZFmWdQP6MND2sP~KxCja6IkEy6LUfyMB6CkWWc6zSZxz18EpVdMhfAM8UKCt4WGfWbiSD4CZZjMNaq95gluCGetUKPSVxIm-XITD2yNKCMntlRbVESQS2bJ83uevbkKIfxHl7SmiTpH7THlmnBe6lSbtdWBkA6eaUhjiQrwAFg17eqVa9-hOGpj4PfRCFEj8oMD7pXKUAR5DtAp5Uo6jFC1TMMemPQbvc8HyV9iE5Pk4RZy~e68C7dFi18s36he9C0MpRSMfV8iTnsk6fnCUQ55HBUdkwD4~Jg__",
    width: 1280,
    height: 960,
    origin: "generated",
    alt: {
      es: "Macro de unas tijeras profesionales de peluquería",
      en: "Macro photograph of professional chrome hairdressing scissors",
    },
  },
  scissorsCutting: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__6/-t-e-x-t_-t-o_-i-m-a-g-e-cb84e1ff-53e1-46a6-af7f-19f0b033e987.png?Expires=2104342215&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=pB1rVt44zGt87PF9N5~zD5Hg~FMWtZLLyrabtWIXSxK8PfJCp6UgCPkQQjVsTIUsWPzMo4qCXeIZRBXtUtdZgjwPuGfri-nNBMd1mdLmeafeauoBwLryy6HF78ACpoY3S7GM8dmtRdc6uhHqQxfGJ7W9-7UL0MiqGmolTH1LmenCVKK1m-M1oWY8oPj2r3oAuI~WxdciQ9Q7TdNrOgooJD3U34fF-8DRR~Eb26kN6pjm3OlsDIu-5PGVQs~UdeWcpCb7oDuajVlDnm7f4SeMklzk9Xqv1rgjQ3gRvUfC9ExfUd7RYo8j2LzipDR~dpn-8mt5RDVZ6731rFZOq-GElQ__",
    width: 1280,
    height: 960,
    origin: "generated",
    alt: {
      es: "Unas manos cortando un mechón de cabello castaño con tijeras profesionales",
      en: "A stylist's hand cutting a lock of dark brunette hair with chrome scissors",
    },
  },
  portraitBrunette: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__8/-t-e-x-t_-t-o_-i-m-a-g-e-e628fc5b-1f88-4892-be63-e116ac9ea89c.png?Expires=2104342370&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=R5Tl3HeqwZuW0w789nXdHizC23~U6-VR2-GBPZ0T58zVW31124~po4h5e2ynbwpOZfz~NQjdhdpHlvEzEN4d8YyeN0-gC7wL-s8Mo-tGk0-ifF7~KwaEsSUoo9ydCj5tKfje3HbxnO0XV5gRd9K7ztsdZW3TJpRwRjo0dR7jKCsG7hRzeT9Gs1USDPrPObohf-MkoPO3nfOHyJynl9vbNSsKhbpTgi-7K51l65~yHp5ipXJVx136WVZGndO8lWUWeUrx7DM6yeYXL3rHpQn2Z~qwR1sEEmr3yDpIn7ac6EfzBudKy7m7TvFbjK4DoY0GLSCY2YYSp4J~wLNh3zew7w__",
    width: 960,
    height: 1280,
    origin: "generated",
    focus: "50% 30%",
    alt: {
      es: "Plano editorial de una melena castaña cayendo sobre el hombro",
      en: "Editorial close crop of dark brunette hair cascading over a shoulder",
    },
  },
  portraitCopper: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__1/-t-e-x-t_-t-o_-i-m-a-g-e-3d043b91-b4cb-44b1-84fd-61b106ff1406.png?Expires=2104342370&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=NdMV4yo-m2EQV1os3KhLNS0pe4FLGIKFv1Z~9VX3xOkSMkWFSO32NGq8TcmBjnqil--mO6at2S49QsMWNbmlHhbyGOhtP0xE8QPzaRDdqfvreIavpqUcQhKnS2F9a9a99OFGoTGzo4mDB~t7-54vHbI8oeEqRkD5vyI2qHoBHHj64ADamAj3Q8nO1Nv34l8tDvFhlDSTgpLk9btl6Q4aBbJz7F3OdPEROhakXM~9q6T~wlvdCrm72PGDvyq7xG-rTisQSYGQMN7Ur3RwFgHet8jFuODS1LWi3scr24L7MkKfMJTBw4kRyiKUQZ8UByJySgg1MoqM-cR29R48yHDkxQ__",
    width: 960,
    height: 1280,
    origin: "generated",
    focus: "50% 30%",
    alt: {
      es: "Plano editorial de una melena cobriza cayendo sobre el hombro",
      en: "Editorial close crop of copper auburn hair cascading over a shoulder",
    },
  },
  textureDetail: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__5/-t-e-x-t_-t-o_-i-m-a-g-e-71caec8d-4c06-4899-8c85-6de18259e7aa.png?Expires=2104342382&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=ca2sG9VkfShicTtY2iaiAod53yCUPyART523WUjDo7C5R39k00Bq7JuGZAuOwgevtZOAoB5M4BRDQyfHz0hy5wbFlmod-I9a~J4AIzoVozzAbITA3j1CIrbpTlY1NdRNKZVrImxvb77cyB-zvadkL9ARlvWFT2HgYt2cHbbhNdZNCeGPocpJHYdPx1w4rBc652lspelYY~rHtedV0ZMcsEDbzNsLDaWtJRJMA3YbSvmqBZjhdMlIJVzw8SDw3fzbwTyz5AtcEa0usrDdZ-mihV555jwmDKz33H~SycVEAC2wpPhaHibYe-aF98SZWHh4m5WZQlV2UuCYWR0hpAbiVg__",
    width: 1280,
    height: 1280,
    origin: "generated",
    alt: {
      es: "Macro extremo de mechones de pelo superpuestos",
      en: "Extreme macro of overlapping hair strand texture",
    },
  },
  movementBlur: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__2/-t-e-x-t_-t-o_-i-m-a-g-e-9c80e826-d6d2-4dd3-ade1-3c82bfedfd06.png?Expires=2104342382&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=FbcDf-U31yEnOOhvR-wIyecTwO5g2EwrAOXmPuNOnsNMulJwLwz76JhNIFRoDVe7Xx6Hm-vvhYedRsAkKlGcwku1kX6IHG8B~T0E8L0FvJcYVKzZV~wv~4aCloV1KcR2kw94iXstASmWn58Q7vbrabD6RWoENJopKQcL54gPElENlAdDubQH4zi10Ju3fNQ9OPhAcP5JQQ7TqXCX~0ipssL2iSiU1SRzkNc83B0kbKhi4LZCGi0RgkDEwo0sPJ~Rsuke34i9uw5FvjFtam1YQ40AGEM9TX8LlVjHPaA6MgcyZMvXeUH2Jpg-n0TWjjCRqR6YLDa~qcQY7oOFEjPemA__",
    width: 1280,
    height: 720,
    origin: "generated",
    alt: {
      es: "Melena oscura en movimiento captada con exposición larga",
      en: "Long exposure of dark hair whipping through the air in motion",
    },
  },
  portraitBlonde: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__3/-t-e-x-t_-t-o_-i-m-a-g-e-1f543d11-3212-4a78-91e2-5e5de045246d.png?Expires=2104342532&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=B04ihY1P7OOvnyw~812aLj69XQ7lmZ9Vm5UaP-wZObmdgdxGMnuz8CHReZZBG1XkhMrGoTGAN-x2chhyVgi24cqDieRCm08yfLFlTKZoJHWZKqRY1Q0pdet9EE2SF7FHmUtOiCiZm2gvA8VLcDO7d-~cBcUVSi6K72ELOTFDkPZQl8CLoVQGb1N~PTSL0HDXjVF26KnZh0NKM9BCcnhTAK9PPwLjTf7aU1bOGEk58CRzigM4gEGRShgIydygzXDG4apyeiIamTEAIqAgJekJK60WqRNCpaa3ig8YQVSGUhgWRt-zB-GoaXBEMfzTTMB8zUkTKe4sSe5OGda0LkLsGg__",
    width: 960,
    height: 1280,
    origin: "generated",
    focus: "50% 30%",
    alt: {
      es: "Plano editorial de una melena rubia cayendo sobre el hombro",
      en: "Editorial close crop of warm blonde hair cascading over a shoulder",
    },
  },
  salonAtmosphere: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__2/-t-e-x-t_-t-o_-i-m-a-g-e-c238dbc2-d42b-4ef6-a80c-f1fd11b07a20.png?Expires=2104342532&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=eIObgLDe7ygio0TTepzlLamMgvOVj0HuOX~j8LRrCXgjaSDW0IgPlA4-UhcT5iac80I2dV~P3Sdjheomi7hoxGH0TyXcwmte~V8tNsZPL8jO4GLJNZ6H0I0t5iZIQlbJqvg69zGWZFHT1vGIvE9fuENGNYpgclm0RnbefIXhMn~tWoEPlGGNM73lSz41ixoHhQg-cRk6bPSO0pZSUt3~iEcLWtbCs05xrNhFKhotBwRVn-2pUfKJZKnbp1ZPTL3YpR~ElKEBcwdThn19TtbuMOidIUYOLwArIHFIAlQThveycXQwu~L0OLSWDYUzF7Et4bnDZuiK2i8CFq8HEMeVcg__",
    width: 1280,
    height: 720,
    origin: "generated",
    alt: {
      es: "Interior minimalista de peluquería con espejo redondo y sillón de trabajo",
      en: "Minimalist boutique hair salon interior with round mirror and styling chair",
    },
  },
  toolsFlatlay: {
    url: "https://cms-toolkit-artifacts.artlist.io/content/-t-e-x-t_-t-o_-i-m-a-g-e-v1/media__8/-t-e-x-t_-t-o_-i-m-a-g-e-90733712-30b3-4022-bcf1-53decbe87d9b.png?Expires=2104342382&Key-Pair-Id=K2ZDLYDZI2R1DF&Signature=qTPUP7vv9vNOZxxi5U~ro-WKVGuFFKPNMnI-CFPJn-DRSvoxWx3NKWJk89ZHHdWdd487BfsdqtoC2Y6m~htsq9GiDRPdB-oF0EftarOf1ZKkK6b6r3aA1XLg4wrnCqjy4ztAc3D~vDqjkUostmjP0jQHGRuJVDUXWt0xspZiecyF1TZ7vN0xIWpsK2t0O~xtnmUIyiMOlHgrKBb5zW9opy3PNeXGyEBSwHG2olkZ6oPuyU5TXLQpZ2vudE5d~dUSO9Ot~nCHp9HeRBbdj9ThfjrAXPalBRWdMljFZdhYLr5A4ZSS37MzUryx7LSiUpuRpjj08Vs-OR-9Zk~lsENxLw__",
    width: 1280,
    height: 960,
    origin: "generated",
    alt: {
      es: "Tijeras y peine profesionales sobre mármol oscuro",
      en: "Flatlay of professional scissors and a comb on dark marble",
    },
  },
};

/** Names the factory sections look for, mapped onto SOUSA's campaign set. */
export const sousaImageMap: Record<string, ImageRef> = {
  ...sousaImages,
  hero: sousaImages.heroBg,
  heroAlt: sousaImages.portraitCopper,
  about: sousaImages.scissorsCutting,
  cta: sousaImages.movementBlur,
  location: sousaImages.salonAtmosphere,
};
