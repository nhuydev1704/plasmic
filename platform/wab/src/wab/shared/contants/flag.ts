import { StarterSectionConfig } from "@/wab/shared/devflags";

export const STARTER_SECTIONS = [
  {
    title: "",
    tag: "general",
    projects: [
      {
        projectId: null,
        baseProjectId: "8eH4mLFb7TqLYDMGjj5BLd",
        name: "Beginner's guide: website in 3 minutes",
        tag: "tutorial-portfolio",
        description: "Learn the core concepts to build a website!",
        highlightType: "first",
      },
      {
        projectId: null,
        baseProjectId: "dbaCEPVWpUk3sS5df62rbF",
        name: "Tutorial: app in 5 minutes",
        tag: "tutorial",
        description: "Learn how to build apps in a hands-on tutorial!",
        highlightType: "first",
      },
      {
        projectId: null,
        baseProjectId: "vP9xXLvZ7Ms4GyJbDi1yom",
        name: "Play Plasmic Levels",
        tag: "game",
        description: "Learn how to build web pages in a set of challenges!",
        highlightType: "second",
      },
      {
        projectId: "uH2TcxhGBVb2jMvpSK4T2N",
        name: "Developer Quickstart",
        tag: "codegen-quickstart",
        description:
          "Integrate with your codebase / set up headless content editing.",
        highlightType: "third",
        href: "https://www.plasmic.app/learn/quickstart/",
      },
    ],
  },
  {
    title: "Blank starters",
    tag: "general",
    projects: [
      {
        projectId: null,
        baseProjectId: "sdoqPTj9hWBno4Bb2hDFnE",
        name: "Website starter",
        tag: "blank",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/website-starter.png",
        publishWizard: true,
        hidden: true,
      },
      {
        projectId: null,
        baseProjectId: "ssfAr8AgjTbALLTojPpsYE",
        name: "CMS starter",
        tag: "blank",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/cms-starter.png",
        publishWizard: true,
        hidden: true,
      },
      {
        projectId: null,
        baseProjectId: "iFsSYtEapLzMxVRRKKtPJi",
        name: "App starter",
        tag: "blankapp",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/app-starter.png",
        publishWizard: true,
      },
    ],
  },
  {
    title: "App templates",
    tag: "general",
    projects: [
      {
        projectId: null,
        baseProjectId: "iFsSYtEapLzMxVRRKKtPJi",
        name: "App starter",
        tag: "blankapp",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/app-starter.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "6sAB6sCjWDFkxD2MAHHkyt",
        name: "Twitter",
        tag: "twitter",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/twitter-starter.png",
        publishWizard: true,
        isPlasmicOnly: true,
      },
      {
        projectId: null,
        baseProjectId: "dokgzdEcQjg7pULXDVWrAX",
        name: "Helpdesk",
        tag: "helpdesk2",
        imageUrl: "https://static1.plasmic.app/starters/helpdesk.png",
        publishWizard: true,
        isPlasmicOnly: true,
      },
      {
        projectId: null,
        baseProjectId: "xi9cXsawBqn741HPDPhkKi",
        name: "Dashboard",
        tag: "dashboard",
        imageUrl: "https://static1.plasmic.app/starters/dashboard.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "4aV9mLPvdKF4VPeTTBWLhP",
        name: "Pokemon Pokedex",
        tag: "pokedex",
        imageUrl: "https://static1.plasmic.app/starters/pokedex.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "63Qx2LxqiLyqYJL6vzCoY9",
        name: "Inventory",
        tag: "inventory",
        imageUrl: "https://static1.plasmic.app/starters/inventory.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "jqsLScpEqiWb74HP2wt459",
        name: "Support Helpdesk Ticketing",
        tag: "helpdesk",
        imageUrl: "https://static1.plasmic.app/starters/helpdesk.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "8Hdb5jdghnUsCfBACDvfRe",
        name: "Community Discussion Forum",
        tag: "forum",
        imageUrl: "https://static1.plasmic.app/starters/forum.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "hnyAG5VPZfdxhmszseJb5w",
        name: "TodoMVC app",
        tag: "todomvc",
        imageUrl: "https://static1.plasmic.app/starters/todomvc.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "4jni2tnFordSTGLEjQ1JE2",
        name: "Applicant tracking system",
        tag: "ats",
        imageUrl: "https://static1.plasmic.app/starters/ats.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "nwF2aBQs9CiAbHFZVZvQzX",
        name: "Management feedback",
        tag: "feedback",
        imageUrl: "https://static1.plasmic.app/starters/feedback.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "o45U1njGWivd3bdELFnmEB",
        name: "Request form and CRM",
        tag: "landscaping",
        imageUrl: "https://static1.plasmic.app/starters/landscaping.png",
        publishWizard: true,
        isPlasmicOnly: true,
      },
      {
        projectId: null,
        baseProjectId: "7G8n9jwdE5WowDWbWsVZ26",
        name: "Commerce storefront",
        tag: "full-commerce-storefront",
        description: "A full ecommerce storefront.",
        imageUrl:
          "https://plasmic-ray.s3.us-west-2.amazonaws.com/ecommerce-starter.png",
        publishWizard: true,
        isPlasmicOnly: true,
        showPreview: true,
        globalContextConfigs: [
          {
            name: "plasmic-commerce-swell-provider",
            props: [
              {
                name: "storeId",
                value: "plasmic-full-commerce-storefront",
              },
              {
                name: "publicKey",
                value: "pk_IX9TXPCQpwoTzNixAkNsFcqUMle5qBE9",
              },
            ],
          },
        ],
      },
      {
        projectId: null,
        baseProjectId: "pJg9wHKhCdPJyHyrT3o6d9",
        name: "Admin Panel",
        tag: "admin-panel",
        imageUrl: "https://static1.plasmic.app/starters/ats.png",
        publishWizard: true,
        isPlasmicOnly: true,
      },
    ],
  },
  {
    title: "Website templates",
    tag: "general",
    projects: [
      {
        projectId: null,
        baseProjectId: "sdoqPTj9hWBno4Bb2hDFnE",
        name: "Blank website",
        tag: "blank",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/website-starter.png",
        publishWizard: true,
        hidden: true,
      },
      {
        projectId: null,
        baseProjectId: "euZipmXYVJ8mwVgFeFc5L5",
        name: "Blank website (mobile-first)",
        tag: "mobile-first",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/mobile-website-starter.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "aKeThz5Aq4356zn3ZiUtVT",
        name: "CMS starter",
        tag: "blank",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/cms-starter.png",
        publishWizard: true,
        hidden: true,
      },
      {
        projectId: null,
        baseProjectId: "rBVncjZMfEPDGmCMNe2QhK",
        name: "Dark SaaS landing page",
        tag: "saas-landing-page",
        description: "A single-landing-page example.",
        imageUrl:
          "https://plasmic-ray.s3.us-west-2.amazonaws.com/saas-landing-page.png",
        publishWizard: true,
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "3RRUWq6Gu7iwXxAXK1AyYv",
        name: "Light SaaS landing page",
        tag: "light-saas-landing-page",
        description: "A single-landing-page example.",
        imageUrl:
          "https://plasmic-ray.s3.us-west-2.amazonaws.com/light-saas-landing-page.png",
        publishWizard: true,
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "n4M5zBj6hVwai4utZd64wk",
        name: "Commerce landing page",
        tag: "commerce-landing-page",
        description: "A single landing-page for a commerce storefront.",
        imageUrl:
          "https://plasmic-ray.s3.us-west-2.amazonaws.com/ecommerce-starter.png",
        publishWizard: true,
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "iYAHDaeAh2Sbj8TXwKwAHH",
        name: "Landing page starter",
        tag: "landing-page",
        description: "A single-landing-page example.",
        imageUrl:
          "https://plasmic-ray.s3.us-west-2.amazonaws.com/landing-starter.png",
        publishWizard: true,
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "6MkpuE8zdJF2QeVYNGRzAE",
        name: "Commerce design sections",
        tag: "commerce-blocks",
        description: "A single-landing-page example.",
        imageUrl:
          "https://plasmic-ray.s3.us-west-2.amazonaws.com/commerce-blocks.png",
        publishWizard: true,
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "qHHB9UthLR9FiAbZWsXhER",
        name: "Simple Light Landing Page",
        tag: "simple-light",
        description: "Based on the Simple Light webpage template by cruip.com.",
        imageUrl: "https://jovial-poitras-57edb1.netlify.app/simple-light.png",
        author: "Cruip",
        authorLink: "https://www.cruip.com",
        publishWizard: true,
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "bT6dMi84CLhP3ovSWmvZH8",
        name: "Furn E-commerce",
        tag: "furn-ecommerce",
        description: "Based on the Furn webpage template by Themesine.",
        imageUrl: "https://jovial-poitras-57edb1.netlify.app/furn.png",
        author: "Themesine",
        authorLink: "https://www.themesine.com",
        publishWizard: true,
        globalContextConfigs: [
          {
            name: "plasmic-commerce-swell-provider",
            props: [
              {
                name: "storeId",
                value: "plasmic-commerce-furn",
              },
              {
                name: "publicKey",
                value: "pk_BukiQnhoM3Q35VxEyNCtmZHrZKSGNUBk",
              },
            ],
          },
        ],
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "cvXUzqk57WomqvTqXQ1QYL",
        name: "Minimalist about-me page",
        tag: "minimalist-about-me-page",
        imageUrl:
          "https://paper-attachments.dropbox.com/s_8FCC2878174B5879F7DC5DC34F2345D5747F0668BB4DEE3C35D836A393EDCF3F_1589177892637_Screen+Shot+2020-05-10+at+11.16.16+PM.png",
        publishWizard: true,
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "vazeCkRNKSUSktb6n8KMns",
        name: "Online course or book",
        tag: "online-course-or-book",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Book-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "sBFFukEUH1AEJiLMz2TQCZ",
        name: "Agency Website",
        tag: "agency-website",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Benchmark-Home.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "tubGdTmxYAVaeSWDnpUE3A",
        name: "SaaS Website",
        tag: "saas-website",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/SaaS-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "oZ8HXHseqvk9ye2zujjfZm",
        name: "Travel Website",
        tag: "travel-website",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Travel-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "fdfeSyMCT4skzKuzs68Gr7",
        name: "Professional Services",
        tag: "professional-services-website",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Professional-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "7u3EZs2coVFFPKJ8WakeSJ",
        name: "Startup Landing Page",
        tag: "startup-landing-page",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/FunStartup-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "qVcxuMzt2v15Zcjphe5atJ",
        name: "Gift Guide",
        tag: "gift-guide",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/GiftGuide-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "bjvvPRnKsB3HNRViVB1PaV",
        name: "Launch Page",
        tag: "launch-page",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/LaunchPage-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "4Srhd9cweVce5FumjT6eeP",
        name: "Return Policy",
        tag: "return-policy",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/ReturnPolicy-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "mHqgNUuPBtN1n7fNgi1BPe",
        name: "Origin",
        tag: "origin",
        author: "Swell Commerce",
        authorLink: "https://www.swell.is",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Origin-Homepage.png",
        showPreview: true,
        globalContextConfigs: [
          {
            name: "plasmic-commerce-swell-provider",
            props: [
              {
                name: "storeId",
                value: "plasmic-sandbox",
              },
              {
                name: "publicKey",
                value: "pk_QaZeGhtpQaVbNQnWJdRlE1abE6Ezf9U9",
              },
            ],
          },
        ],
      },
      {
        projectId: null,
        baseProjectId: "xzs1LrWf19njiF5s2KYbfK",
        name: "Vercel Commerce Theme",
        tag: "vercel-commerce",
        author: "Vercel",
        authorLink: "https://nextjs.org/commerce",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/VercelCommerce-Homepage.png",
        showPreview: true,
        globalContextConfigs: [
          {
            name: "plasmic-commerce-shopify-provider",
            props: [
              {
                name: "storeDomain",
                value: "next-js-store.myshopify.com",
              },
              {
                name: "accessToken",
                value: "ef7d41c7bf7e1c214074d0d3047bcd7b",
              },
            ],
          },
        ],
      },
      {
        projectId: null,
        baseProjectId: "wkCYmo8QjqzuWDuaePRxbx",
        name: "Commerce Storefront",
        tag: "commerce-storefront",
        author: "Commerce.js",
        authorLink: "https://commercejs.com/",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Commerce-Homepage.png",
        showPreview: true,
        globalContextConfigs: [
          {
            name: "plasmic-commerce-swell-provider",
            props: [
              {
                name: "storeId",
                value: "plasmic-commerce-storefront",
              },
              {
                name: "publicKey",
                value: "pk_sv6phRbZg3YRryYB3MpSSBxwmOGuiM9f",
              },
            ],
          },
        ],
      },
      {
        projectId: null,
        baseProjectId: "fyh3o8VEMm93eRQTvVsxAN",
        name: "Influencer Campaign Page",
        tag: "influencer-campaign-page",
        author: "Commerce.js",
        authorLink: "https://commercejs.com/",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Commerce2-Homepage.png",
        showPreview: true,
        globalContextConfigs: [
          {
            name: "plasmic-commerce-swell-provider",
            props: [
              {
                name: "storeId",
                value: "plasmic-influencer-campaign",
              },
              {
                name: "publicKey",
                value: "pk_BQeBH9Xemhu4QnCP1VGX0gfZle1x5ThI",
              },
            ],
          },
        ],
      },
      {
        projectId: null,
        baseProjectId: "5zZHKpJuhgEcmL4s6pdBK3",
        name: "Planty",
        tag: "planty",
        author: "Snipcart",
        authorLink: "https://www.snipcart.com",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Planty-Home.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "rYojmu8FKzCJpWhkjzwVa3",
        name: "Beverage Products",
        tag: "beverage-products",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Juice-Home.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "hZZvbLe4oiSacZamGvvjxw",
        name: "Juice Products",
        tag: "juice-products",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/JuiceProducts-Home.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "i4QvYzmnxAEbVnPoGEFQvv",
        name: "Classy Agency Website",
        tag: "classy-agency-website",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Classy-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "9eXZmXFiE46HtEm4YyAaqx",
        name: "Food Blog",
        tag: "food-blog",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/Food-Homepage.png",
        showPreview: true,
      },
      {
        projectId: null,
        baseProjectId: "d5NxbvbwfUke8awMoMYDwD",
        name: "Real State Agency",
        tag: "real-estate-agency",
        imageUrl:
          "https://plasmic-page-templates-thumbs.s3.us-west-2.amazonaws.com/RealState-Homepage.png",
        showPreview: true,
      },
    ],
  },
  {
    title: "Website clones",
    tag: "general",
    projects: [
      {
        projectId: null,
        baseProjectId: "26GuMkEUafUorKKAdvS6RC",
        name: "Apple",
        tag: "apple",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/apple.png",
        publishWizard: true,
      },
      {
        projectId: null,
        baseProjectId: "gq6Q9w9ZSkA8EpxuFWY1YJ",
        name: "Vercel Workflow",
        tag: "vercel-workflow",
        imageUrl:
          "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/vercel-workflow.png",
        publishWizard: true,
      },
    ],
  },
] as StarterSectionConfig[];
