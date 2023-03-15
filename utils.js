let IPS = [];
let timeoutID = null;

export const setVisitor = async (ip) => {
  let properIP = ip;
  if (ip.includes("::")) {
    const ipv4Regex = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/;
    const match = ip.match(ipv4Regex);
    if (match) {
      properIP = match[1];
    }
  }

  const exists = IPS.find((item) => item.ip === properIP);
  if (!exists) {
    IPS.push(properIP);
  }
  console.log("req ip", IPS);
};
