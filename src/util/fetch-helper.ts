async function streamToString(stream: any): Promise<string> {
    if (!stream) {
        return '';
    }
    // lets have a ReadableStream as a stream variable
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
}

export const fetchBcomDestinationSuggestions = async (destination: string) => {
  try {
    const body = { query: destination, pageview_id: "2b2220c885aa0034", aid: 304142, language: "en-us", size: 5 };

    const resp = await fetch("https://accommodations.booking.com/autocomplete.json", {
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "text/plain;charset=UTF-8",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "cookie": "pcm_personalization_disabled=0; bkng_sso_auth=CAIQ0+WGHxpm24697i4MdezKxDtnRJdnywhLo86Vk3KaNjpUIlaOg0+hWcPSIbyBEsk+pHkTD9ng3JzJdVtOL+4YT+2EqZOSLgeUA277JommRrR7KD75JFPPAT8+Ozt+dnPn9zk5Z0MScqPxOa2p; pcm_consent=analytical%3Dtrue%26countryCode%3DUS%26consentId%3D2df4ef51-8a00-4ae6-8784-ffbd713f21cf%26consentedAt%3D2025-05-24T04%3A24%3A37.098Z%26expiresAt%3D2025-11-20T04%3A24%3A37.098Z%26implicit%3Dtrue%26marketing%3Dtrue%26regionCode%3DWA%26regulation%3Dnone%26legacyRegulation%3Dnone; cors_js=1; BJS=-; _gid=GA1.2.590316985.1748060679; _gcl_au=1.1.69422775.1748060680; bkng_prue=1; cgumid=5ednAl9Oa1VEUVY5QUFuNXk1OHQwdG9wclhQdlhqcnp2cFJIcGxRbHc2QyUyRmpFbTAlM0Q; _yjsu_yjad=1748060681.045085a6-e4d8-4d11-8342-f097fe9b6c70; FPID=FPID2.2.OHnGc%2B5dHznx5zIFhSFaFA3NLS%2BgPg%2Fd7UDojPwdpbo%3D.1748060679; FPLC=aoWLCvu2LtjhH3gcLq8%2BnNOtEX16fYb7PXFfGNhWqE3yTtif%2FQ%2BM%2FHLoIPQGGuPA4lujp5Oztw10N4iY3w36ZjEUi9CRonbxsigGo%2BBA2Jmb19jzoiRAvDXgX2sRMg%3D%3D; FPAU=1.1.69422775.1748060680; bkng_sso_ses=e30; bkng_sso_session=e30; fasc=d35f0a1c-a967-4d23-8e72-f80a4521b47b; pc_payer_id=8460ca21-11e1-48e1-a3dd-51350cfcf88c; fsc=s%3A11413de74cf5009f1b3504ff145abb99.1RvKRRV7Nr4cTnfSj73cGF%2FO4R%2BCJFdeY52NX9AtGa4; _uetsid=0298aee0385711f097b14bef217d4bd7; _uetvid=0298d3b0385711f0b32ef900cedffb32; _ga_A12345=GS2.1.s1748060680$o1$g1$t1748061586$j0$l0$h1485813142; _ga=GA1.1.1302469940.1748060679; cto_bundle=Fprp7l9tWnVqdFhZdWJ3NU9FSWpTYnRjMG1HaUJFelNUcW1MWUtHRkVjaiUyRm4lMkJZRjVTYm9RdFA1RFJ2Sjg4R1E2Y1lmJTJGQXA1YVllJTJCMCUyRmRKN0hleXZaVlVKQzFSRyUyRmszVzdpVjQ3WXJiejE1clF6cXRzalRhTG52WFlVNzU2TWRWb0ZpV1g5RVdFVXdVaHhjVnF1MHRrMmxnMHhiZlh5akMwa1NTN2Z3NENCWGZxYmwzR2NmJTJGJTJGQWZyTWFLTG1Fb2JUdlBEanR6Q1NQJTJCNjV2RyUyQkhyNVFXVm12NGclM0QlM0Q; bkng=11UmFuZG9tSVYkc2RlIyh9Yaa29%2F3xUOLbca8KLfxLPeetNRqZ7sa2CkZB9qJrPKMPyk4D10lbcf%2BWQ%2F%2FLvXbx0nLvXpGpPfcKJx%2FswzH7hHE7WYePK9KuDUB%2FUeVCSisquw0NJu%2B28w5GDaTnhDh3GujIhnGTw8onpjXgC%2BCY%2FeggI58QBPd074mD4FWm8e%2B6tYagaSe83uo%3D; aws-waf-token=96baac94-0a89-4955-bcb3-4602516339c7:FAoAk8kgadU1AAAA:9bDcwe0bN+Vi5xIC5mLWM+RZ7/JEji0znm2HLr18ouBpsj9pmjwae4sTpGWuiIDCzlwxtuxeSlV5IgcqgbHVxtM5zhGueUjEh8GxiBxoMbGe6gMZ8xyJeEoDCN16qK/MTzkT3BIHjwnbegldA1YeWZuEDQmIWVirIlUHJf0uEk9KfQWWHKXjf1Iq3/pjA/zB7cOYERqRHwnSnm6jUOF2HOpo8MV2rA0w8knv6XJEjHs/z95TFqGEp/Nh+ivKdmOkFhQ=; lastSeen=0",
        "Referer": "https://www.booking.com/",
        "Referrer-Policy": "origin-when-cross-origin"
      },
      body: JSON.stringify(body),
      method: "POST"
    });

    const data = await streamToString(resp.body);
    return JSON.parse(data);
  } catch (error) {
    return error;
  }
}

export const getFlightsDestinations = async () => { 
  try {
    const bookingDotComResp = await fetch("https://flights.booking.com/api/autocomplete/en?q=los%20an&accessToken=", {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "cookie": "pcm_personalization_disabled=0; bkng_sso_auth=CAIQ0+WGHxpm24697i4MdezKxDtnRJdnywhLo86Vk3KaNjpUIlaOg0+hWcPSIbyBEsk+pHkTD9ng3JzJdVtOL+4YT+2EqZOSLgeUA277JommRrR7KD75JFPPAT8+Ozt+dnPn9zk5Z0MScqPxOa2p; pcm_consent=analytical%3Dtrue%26countryCode%3DUS%26consentId%3D2df4ef51-8a00-4ae6-8784-ffbd713f21cf%26consentedAt%3D2025-05-24T04%3A24%3A37.098Z%26expiresAt%3D2025-11-20T04%3A24%3A37.098Z%26implicit%3Dtrue%26marketing%3Dtrue%26regionCode%3DWA%26regulation%3Dnone%26legacyRegulation%3Dnone; cors_js=1; BJS=-; _gid=GA1.2.590316985.1748060679; _gat=1; _gcl_au=1.1.69422775.1748060680; bkng_prue=1; _ga=GA1.1.1302469940.1748060679; cgumid=5ednAl9Oa1VEUVY5QUFuNXk1OHQwdG9wclhQdlhqcnp2cFJIcGxRbHc2QyUyRmpFbTAlM0Q; cto_bundle=qFypLl9keWZXakd1bHI0N3Y3YmJsZmVaTmdGc2NacXBXekVvYXclMkZjWXBMTnJVQUdXWnljRkw1NVp5dE1ZbXZvQzNYRFk4TmNvMUozNTRueTNrRFA5UXNPQ1lyTEFWRXFJUzdUcVRxTFElMkYxY2tNcHZFYjM5c2NyeTB2bUYlMkJrVE5CVyUyQjdzdU1YWGdwZWFEWHhZTUJmRG0wSThZaDJKMmwxbFE5QjFwUnNJNW5GZFRRcm5WSklodCUyQjlLaGlkQVdCNGg2b2FDVkp2cFo5RCUyQjM0bWVjTDhVeW1hc253JTNEJTNE; _yjsu_yjad=1748060681.045085a6-e4d8-4d11-8342-f097fe9b6c70; FPID=FPID2.2.OHnGc%2B5dHznx5zIFhSFaFA3NLS%2BgPg%2Fd7UDojPwdpbo%3D.1748060679; FPLC=aoWLCvu2LtjhH3gcLq8%2BnNOtEX16fYb7PXFfGNhWqE3yTtif%2FQ%2BM%2FHLoIPQGGuPA4lujp5Oztw10N4iY3w36ZjEUi9CRonbxsigGo%2BBA2Jmb19jzoiRAvDXgX2sRMg%3D%3D; FPAU=1.1.69422775.1748060680; bkng_sso_ses=e30; bkng_sso_session=e30; fasc=d35f0a1c-a967-4d23-8e72-f80a4521b47b; pc_payer_id=8460ca21-11e1-48e1-a3dd-51350cfcf88c; fsc=s%3A11413de74cf5009f1b3504ff145abb99.1RvKRRV7Nr4cTnfSj73cGF%2FO4R%2BCJFdeY52NX9AtGa4; _ga_A12345=GS2.1.s1748060680$o1$g1$t1748060712$j0$l0$h1485813142; lastSeen=1748060712532; _uetsid=0298aee0385711f097b14bef217d4bd7; _uetvid=0298d3b0385711f0b32ef900cedffb32; fsc=s%3A11413de74cf5009f1b3504ff145abb99.1RvKRRV7Nr4cTnfSj73cGF%2FO4R%2BCJFdeY52NX9AtGa4; bkng=11UmFuZG9tSVYkc2RlIyh9Yaa29%2F3xUOLbKE7bjkbYWznZ3hZ%2BSllo8bL5%2FqLysqbbZtelR1mWth14zgQxVhg6BfTudGi2%2FaMlYNVPX7hgGfPKfztIDuh3fmx%2FLrUBRENnNARJrP7XBbAJGJAz9PnnncyVHiXdHDld6wNySfvxODqFka0ZTf%2Bx3H8XEQHhZ8i2rw7GV7SwoAs%3D; aws-waf-token=96baac94-0a89-4955-bcb3-4602516339c7:FAoAk8keoEAqAAAA:fk7FMdq+Ynx443sLrBkymX27fofPbSUxA6olvxXOfeqUJIrUbQvsYOAhMH33apky6TtitS7n/7KQRA2XBeBJoz/1UQ1M+f5KXa3GP8wzndLmFACIjqpA907YgqTkH7zq8rjePT7PkpL1izHxTSGwVUixexJXw5FhHmF8MuhQet84MWoOknv64vfELXLU6JsevEDNn8uneoP0LCjc/yUkpZzLCUf3RIW3Tr0CbTPikNeLdjcm6BEsvOBk/qmvFWIMf4Q="
      },
      "referrerPolicy": "no-referrer",
      "body": null,
      "method": "GET"
    });

    const data = await streamToString(bookingDotComResp.body);
    return JSON.parse(data);
  } catch (error) {
    return error;
  }
};