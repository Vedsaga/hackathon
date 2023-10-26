/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ["tsdr.uspto.gov", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tsdr.uspto.gov",
        port: "",
        pathname: "/img/**/large",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-**-**-?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
};
