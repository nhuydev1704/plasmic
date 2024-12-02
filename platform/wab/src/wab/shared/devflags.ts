import {
  ApiFeatureTier,
  FeatureTierId,
  ProjectId,
  StripePriceId,
  TeamId,
  WorkspaceId,
} from "@/wab/shared/ApiSchema";
import { assert, ensureType, mergeSane } from "@/wab/shared/common";
import { DEFAULT_DEVFLAG_OVERRIDES } from "@/wab/shared/devflag-overrides";
import {
  featureTiers,
  newFeatureTiers,
} from "@/wab/shared/pricing/pricing-utils";
import { InsertPanelConfig, UiConfig } from "@/wab/shared/ui-config-utils";
import { cloneDeep, pick } from "lodash";

export interface StarterSectionConfig {
  title: string; // Shown as the heading
  tag: string; // tags should be unique!
  projects: StarterProjectConfig[];
  infoTooltip?: string; // Shows up as a tooltop over the info icon
  docsUrl?: string; // Link for "View docs"
  moreUrl?: string; // Link for "More"
  isPlasmicOnly?: boolean;
}
export interface StarterGlobalContextConfig {
  name: string;
  props: {
    name: string;
    value: string | null;
  }[];
}
export interface StarterProjectConfig {
  name: string; // name of the starter
  projectId?: string; // project to clone
  baseProjectId?: string; // project whose latest published version we wish to clone
  tag: string; // tags should be unique!
  description: string; // description in card (name auto-retrieved from server)
  author?: string; // for template attribution
  authorLink?: string; // link to author
  iconName?: string; // name of icon component to display next to title - resolved in StarterGroup
  imageUrl?: string; // Preview image URL (e.g. on S3)
  highlightType?: "first" | "second" | "third"; // for coloring the cards
  href?: string; // if it's just a link (Developer Quickstart should be the only such thing)
  publishWizard?: boolean; // true if should show the publish wizard on the first open
  showPreview?: boolean; // true if this starter can be previewed in /templates/${tag}
  // show notification for users when the global context values aren't modified
  globalContextConfigs?: StarterGlobalContextConfig[];
  isPlasmicOnly?: boolean;
  withDropShadow?: boolean;
  cloneWithoutName?: boolean;
}

export type InsertableTemplateTokenResolution =
  | "inline"
  | "reuse-by-name"
  | "reuse-by-value"
  | "reuse-by-name-and-value"
  | "retain-by-name" // deprecated
  | "retain-by-value" // deprecated
  | "retain-by-name-and-value"; // deprecated

export type InsertableTemplateComponentResolution =
  | "inline"
  | "reuse"
  | "duplicate" // deprecated
  | "import"; // deprecated

/**
 * Represents a collection of related templates (e.g. Hero sections)
 */
export interface InsertableTemplatesGroup {
  sectionKey?: string;
  sectionLabel?: string;
  onlyShownIn?: "old" | "new";
  type: "insertable-templates-group";
  name: string;
  items: InsertableTemplatesSelectable[];
  imageUrl?: string;
  isPageTemplatesGroup?: boolean;
  hidden?: boolean;
}

export interface Installable {
  type: "ui-kit";
  name: string;
  sectionLabel?: string;
  isInstallOnly: true;
  isNew?: boolean;
  groupName: string; // Used to prefix imported assets
  projectId: string;
  imageUrl?: string;
  entryPoint: {
    type: "component" | "page" | "arena";
    name: string;
  };
}

/**
 * Represents a single template (pulled from a component)
 */
export interface InsertableTemplatesItem {
  type: "insertable-templates-item";
  projectId: string; // Where to find the template
  componentName: string; // Name of component to insert
  imageUrl?: string; // A preview image
  displayName?: string;
  groupName?: string;
  onlyShownIn?: "old" | "new";
  tokenResolution?: InsertableTemplateTokenResolution;
  componentResolution?: InsertableTemplateComponentResolution;
  hidden?: boolean;
}

/**
 * Represents a single template (pulled from a component)
 */
export interface InsertableTemplatesComponent {
  type: "insertable-templates-component";
  projectId: string; // Where to find the template
  componentName: string; // Name of component to insert
  groupName?: string;
  /**
   * Globally unique name of the template; should match up with
   * Component.templateInfo.name of the corresponding component.
   * By convention, starts with plasmic-*
   */
  templateName: string;
  imageUrl?: string; // A preview image
  displayName?: string;
  tokenResolution?: InsertableTemplateTokenResolution;
  componentResolution?: InsertableTemplateComponentResolution;
  hidden?: boolean;
}

/**
 * Represents a collection of icons
 * Unlike templates, where we'll specify individual components,
 * here we'll just grab all icons from the project
 */
export interface InsertableIconsGroup {
  type: "insertable-icons-group";
  name: string;
  projectId: string;
  hidden?: boolean;
}

export type InsertableTemplatesSelectable =
  | InsertableTemplatesItem
  | InsertableTemplatesGroup
  | InsertableIconsGroup
  | InsertableTemplatesComponent;

export interface HostLessPackageInfo {
  syntheticPackage?: boolean;
  type: "hostless-package";
  name: string;
  sectionLabel: string;
  hiddenWhenInstalled?: boolean;
  codeName?: string;
  codeLink?: string;
  projectId: string | string[];
  items: HostLessComponentInfo[];
  hidden?: boolean;
  showInstall?: boolean;
  whitelistDomains?: string[];
  whitelistTeams?: string[];
  isInstallOnly?: boolean;
  imageUrl?: string;
  onlyShownIn?: "old" | "new";
}

export interface HostLessComponentInfo {
  type: "hostless-component";
  componentName: string;
  displayName: string;
  gray?: boolean;
  monospaced?: boolean; // for monospace font
  imageUrl?: string;
  videoUrl?: string;
  hidden?: boolean;
  isFake?: boolean;
  description?: string;
  hiddenOnStore?: boolean;
  onlyShownIn?: "old" | "new";
  requiredHostVersion?: number;
  args?: { [prop: string]: any };
}

type InsertableByTypeString<T extends InsertableTemplatesSelectable["type"]> =
  T extends "insertable-templates-item"
    ? InsertableTemplatesItem
    : T extends "insertable-templates-component"
    ? InsertableTemplatesComponent
    : T extends "insertable-templates-group"
    ? InsertableTemplatesGroup
    : T extends "insertable-icons-group"
    ? InsertableIconsGroup
    : never;

export function flattenInsertableTemplatesByType<
  T extends InsertableTemplatesSelectable["type"]
>(
  item: InsertableTemplatesSelectable | undefined,
  type: T
): InsertableByTypeString<T>[] {
  if (!item) {
    return [];
  } else if (item.type === type) {
    return [item as InsertableByTypeString<T>];
  } else if (item.type === "insertable-templates-group") {
    return item.items.flatMap((i) => flattenInsertableTemplatesByType(i, type));
  } else {
    return [];
  }
}

export function flattenInsertableTemplates(
  item?: InsertableTemplatesSelectable
): InsertableTemplatesItem[] {
  if (!item || item.type === "insertable-icons-group") {
    return [];
  } else if (item.type === "insertable-templates-item") {
    return [item];
  } else if (item.type === "insertable-templates-group") {
    return item.items.flatMap((i) => flattenInsertableTemplates(i));
  } else if (item.type === "insertable-templates-component") {
    return [];
  } else {
    assert(
      false,
      "Not expected insertable template type: " + typeof item === "object"
        ? JSON.stringify(item)
        : item
    );
  }
}

export function flattenInsertableIconGroups(
  item?: InsertableTemplatesSelectable
): InsertableIconsGroup[] {
  if (!item || item.type === "insertable-templates-item") {
    return [];
  } else if (item.type === "insertable-icons-group") {
    return [item];
  } else if (item.type === "insertable-templates-group") {
    return item.items.flatMap((i) => flattenInsertableIconGroups(i));
  } else if (item.type === "insertable-templates-component") {
    return [];
  } else {
    assert(
      false,
      "Not expected insertable template type: " + typeof item === "object"
        ? JSON.stringify(item)
        : item
    );
  }
}

const INSERT_PANEL_CONTENT: InsertPanelConfig = {
  aliases: {
    accordion: "plasmic-antd5-collapse",
    alert: "template:plasmic-alert",
    appLayout: "hostless-rich-layout",
    button: "default:button",
    buttonGroup: "plasmic-antd5-radio-group/button",
    calendar: "hostless-rich-calendar",
    card: "template:plasmic-card",
    carousel: "hostless-slider",
    chart: "hostless-react-chartjs-2-simple-chart",
    checkbox: "default:checkbox",
    dataDetails: "hostless-rich-details",
    dataFetcher: "builtincc:plasmic-data-source-fetcher",
    dataList: "hostless-rich-list",
    dataProvider: "hostless-data-provider",
    dateTimePicker: "plasmic-antd5-date-picker",
    dialog: "template:plasmic-dialog",
    drawer: "template:plasmic-drawer",
    embedCss: "global-embed-css",
    embedHtml: "hostless-embed",
    form: "plasmic-antd5-form",
    iframe: "hostless-iframe",
    input: "default:text-input",
    loadingBoundary: "hostless-loading-boundary",
    lottie: "hostless-lottie-react",
    navbar: "hostless-plasmic-navigation-bar",
    numberInput: "plasmic-antd5-input-number",
    pageMeta: "builtincc:hostless-plasmic-head",
    parallax: "hostless-scroll-parallax",
    passwordInput: "plasmic-antd5-input-password",
    popover: "hostless-radix-popover",
    radioGroup: "plasmic-antd5-radio-group",
    reveal: "hostless-reveal",
    richText: "hostless-react-quill",
    select: "default:select",
    statistic: "template:plasmic-statistic",
    switch: "default:switch",
    table: "hostless-rich-table",
    tilt3d: "hostless-parallax-tilt",
    timer: "hostless-timer",
    tooltip: "template:plasmic-tooltip",
    upload: "plasmic-antd5-upload",
    video: "hostless-html-video",
    youtube: "hostless-youtube",
  },
  overrideSections: {
    website: {
      "Default components": {
        Common: [
          "text",
          "section",
          "columns",
          "image",
          "icon",
          "button",
          "form",
        ],
      },
    },
  } as Record<string, Record<string, Record<string, string[]>>>,
  builtinSections: {
    "Default components": {
      Common: [
        "table",
        "text",
        "button",
        "input",
        "select",
        "image",
        "form",
        "section",
        "columns",
      ],
      General: ["button", "text", "heading", "link"],
      Display: [
        "table",
        "dataList",
        "dataDetails",
        "chart",
        "carousel",
        "card",
        "statistic",
      ],
      "Data entry": [
        "form",
        "input",
        "checkbox",
        "select",
        "dateTimePicker",
        "radioGroup",
        "numberInput",
        "passwordInput",
        "upload",
      ],
      Media: ["image", "icon", "video", "youtube"],
      Layout: ["section", "columns", "vstack", "hstack", "grid", "box"],
      Navigation: ["appLayout", "navbar", "link", "linkContainer"],
      Interactions: ["reveal", "parallax", "tilt3d", "lottie"],
      HTML: ["iframe", "embedHtml", "embedCss"],
      Advanced: ["dataFetcher", "loadingBoundary", "dataProvider", "pageMeta"],
    },
  },
};

const production = process.env.NODE_ENV === "production";

const DEFAULT_DEVFLAGS = {
  appContentBaseUrl: "https://docs.plasmic.app/app-content",
  artboardEval: true,
  autoSave: true,
  brands: {
    "": {
      logoHref: ensureType<string | undefined>(undefined),
      logoImgSrc: ensureType<string | undefined>(undefined),
      logoTooltip: "Back to dashboard",
    },
    SOME_TEAM_ID: {
      logoHref: "https://responsival.com",
      logoImgSrc:
        "https://assets-global.website-files.com/60a6b5ea9c13555ad76844c1/61311bbe3d92e0aafc264094_blink_1.svg",
      logoTooltip: "",
    },
  },
  content: true,
  contentEditorMode: false,
  codegenHost: process.env.CODEGEN_HOST || "https://codegen.plasmic.app",
  codegenOriginHost:
    process.env.CODEGEN_ORIGIN_HOST ||
    process.env.CODEGEN_HOST ||
    "http://codegen-origin.plasmic.app",
  adminTeamDomain: production ? "plasmic.app" : "admin.example.com",
  defaultHostUrl:
    process.env.REACT_APP_DEFAULT_HOST_URL ||
    "https://host.plasmicdev.com/static/host.html",
  defaultOpenStylePanels: true,
  dynamicPages: true,
  enablePlasmicHosting: true,
  // Used to invalidate etag cacheing mechanism altogether
  disableETagCaching: false,
  // Used to invalidate etags that use it
  eTagsVersionPrefix: "0",
  // The tiers to get dynamically retrieve from the server
  featureTierNames: featureTiers,
  useNewFeatureTiers: true,
  newFeatureTierNames: newFeatureTiers,
  freeTier: ensureType<ApiFeatureTier>({
    createdAt: "2021-08-05T23:39:21.570Z",
    updatedAt: "2023-05-22T23:39:21.570Z",
    deletedAt: null,
    createdById: null,
    updatedById: null,
    deletedById: null,
    id: "freeTier" as FeatureTierId,
    name: "Free",
    monthlySeatPrice: 0,
    monthlySeatStripePriceId: "price_1JLFtfHIopbCiFei4rR6omdz" as StripePriceId,
    monthlyBasePrice: null,
    monthlyBaseStripePriceId: null,
    annualSeatPrice: 0,
    annualSeatStripePriceId: "price_1LG1ZcHIopbCiFeigziyEF6W" as StripePriceId,
    annualBasePrice: null,
    annualBaseStripePriceId: null,
    minUsers: 0,
    maxUsers: 3,
    privateUsersIncluded: 10,
    maxPrivateUsers: 10,
    publicUsersIncluded: 10000,
    maxPublicUsers: 10000,
    versionHistoryDays: 14,
    maxWorkspaces: null,
    designerRole: false,
    contentRole: false,
    editContentCreatorMode: false,
    splitContent: false,
    localization: false,
    analytics: false,
    monthlyViews: 50000,
  }),
  freeTrial: false,
  freeTrialTierName: "Growth",
  newFreeTrialTierName: "Team",
  freeTrialDays: 15,
  productHuntPromo: false,
  freeTrialPromoDays: 60,
  createTeamPrompt: true,
  hideHelpForUsers: [".*@example.com"],
  hideStartersForUsers: [".*@example.com"],
  insertPanelContent: INSERT_PANEL_CONTENT,
  insertableTemplates: ensureType<InsertableTemplatesGroup | undefined>(
    undefined
  ),
  installables: ensureType<Installable[]>([]),
  hostLessComponents: ensureType<HostLessPackageInfo[] | undefined>([
    {
      type: "hostless-package",
      name: "Plume Customizable Components",
      syntheticPackage: true,
      sectionLabel: "Design systems",
      isInstallOnly: true,
      imageUrl: "https://static1.plasmic.app/plasmic-logo.png",
      codeName: "plume",
      codeLink: "",
      onlyShownIn: "new",
      items: [
        {
          type: "hostless-component",
          componentName: "Plume",
          displayName: "Plume Design System",
          imageUrl: "https://static1.plasmic.app/plasmic-logo.png",
        },
      ],
      projectId: [],
    },
    {
      type: "hostless-package",
      name: "More HTML elements",
      syntheticPackage: true,
      sectionLabel: "Design systems",
      isInstallOnly: true,
      imageUrl:
        "https://plasmic-static1.s3.us-west-2.amazonaws.com/insertables/unstyled.png",
      codeName: "unstyled",
      codeLink: "",
      onlyShownIn: "new",
      items: [
        {
          type: "hostless-component",
          componentName: "Unstyled",
          displayName: "More HTML elements",
          imageUrl:
            "https://plasmic-static1.s3.us-west-2.amazonaws.com/insertables/unstyled.png",
        },
      ],
      projectId: [],
    },
  ]),
  // Turns on PlasmicImg for all
  usePlasmicImg: false,
  usePlasmicTranslation: false,
  showPlasmicImgModal: false,
  imgOptimizerHost: "https://img.plasmic.app",
  introYoutubeId: "K_YzFBd7b2I",
  noFlipTags: true,
  proxyDomainSuffixes: [".devtun.plasmic.app", ".prox1.plasmic.link"],
  revisionNum: undefined,
  richtext2: true,
  secretApiTokenTeams: ["teamId"],
  selectInserted: true,
  showFullPreviewWarning: true,
  skipFreeVars: true,
  starterSections: [
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
          baseProjectId: "iYCLUNn8WMpw1U62MWQZGm",
          name: "Website starter",
          tag: "blank",
          imageUrl:
            "https://plasmic-static1.s3-us-west-2.amazonaws.com/starters/website-starter.png",
          publishWizard: true,
          hidden: true,
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
          baseProjectId: "iYCLUNn8WMpw1U62MWQZGm",
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
          description:
            "Based on the Simple Light webpage template by cruip.com.",
          imageUrl:
            "https://jovial-poitras-57edb1.netlify.app/simple-light.png",
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
  ] as StarterSectionConfig[],
  versions: true,
  showMultipleAvatars: true,
  hiddenQuickstartPlatforms: ensureType<string[]>([]),
  mungeErrorMessages: {
    "AuthError: CSRF token mismatch":
      "Your login session has expired. Please reload to log in again.",
  },
  showCopilot: true,

  loaderBundler: "esbuild",
  esbuildProjectIds: [] as string[],
  hostLessWorkspaceId: undefined as WorkspaceId | undefined,
  manuallyUpdatedHostLessProjectIds: [] as string[],
  whitespaceNormalProjectIds: [] as string[],
  useWhitespaceNormal: false,
  autoUpgradeHostless: true,

  writeApiSizeLimit: 70000000, // 70MB
  writeApiExcludedProjectIds: [] as string[],

  // Disabled by default
  runningInCypress: false,
  posthog: true,
  copilotTab: false,
  copilotClaude: false,
  cleanRedundantOverrides: false,
  cms: false,
  comments: false,
  commentsTeamIds: [] as TeamId[],
  rightTabs: true,
  codePreview: false,
  demo: false,
  direct: false,
  enableReactDevTools: false, // used in studio.js
  hideBlankStarter: false,
  hideSingleSlots: false,
  hideSyncStatusIndicator: false,
  interactiveCanvas: true,
  insert2022Q4: true,
  sso: false,
  omnibar: false,
  orderVariantsByUid: false,
  paywalls: false,
  showCondVariants: false,
  showIntroSplash: false,
  skipInvariants: false,
  uncatchErrors: false,
  // Prefers loading state over expression fallback
  useLoadingState: false,
  showHiddenHostLessComponents: false,
  ccStubs: false,
  workspaces: false,
  noObserve: false,
  plexus: false,
  incrementalObservables: false,
  spacing: true,
  spacingArea: true,
  setHostLessProject: false,
  plasmicHostingSubdomainSuffix: "plasmic.run",
  splits: true,
  mutateState: false,
  refActions: false,
  multiSelect: false,
  dataTabTourForUsersBefore: "2023-02-28",
  pageLayout: false,
  mainContentSlots: false,
  insertTemplatesIntoMainContentSlots: false,
  simplifiedScreenVariants: false,
  simplifiedForms: false,
  schemaDrivenForms: false,
  hostUrl: "",
  globalTrustedHosts: ["https://example123.fake"],
  warningsInCanvas: false,
  previewSteps: false,

  // Permanently disabled, just internal tools/scripts.
  autoInitEmptyThemeStyles: false,
  allowPlasmicTeamEdits: false,

  // variant experiments
  variants: false,
  unconditionalEdits: false,
  ephemeralRecording: false,
  framerTargeting: true,

  // debugging user projects
  debug: false, // turns on other debug flags in `normalizeDevFlags`
  loadingDebug: false, // shows canvas frame loading debug UI
  logToConsole: !production,

  // github settings
  githubClientId: "Iv1.8a4a47b0b0d4bf88",
  githubAppName: "plasmic-app",

  // change simplified defaults
  simplifiedLayout: false,

  imageControls: false,

  componentThumbnails: false,

  // Enables the margin and padding spacing visualizer improvements
  spacingVisualizer202209: true,
  gapControls: false,
  contentOnly: false,
  publishWithTags: true,
  ancestorsBoxes: true,
  branching: false,
  disableBranching: false,
  branchingTeamIds: [] as TeamId[],
  commitsOnBranches: false,
  appAuth: false,
  advancedAppAuth: false,
  serverPublishProjectIds: [] as ProjectId[],
  focusable: false,
  envPanel: false,
  linting: false,

  // Number of arenas to keep in memory
  liveArenas: 6,

  analytics: false,
  analyticsPaywall: false,
  monthlyViewsPaywall: false,
  verifyMonthlyViews: false,

  debugCmsForms: false,

  hiddenDataSources: [] as string[],

  // Custom top frame URLs; if Studio is loaded from a custom
  // domain, then this allows us to recognize it as the top frame
  // Hard-coding this for now as db-based flag overrides are
  // not yet loaded when it is needed.
  topFrameUrls: ["https://studio.plsmc.dev"] as string[],

  defaultContentCreatorConfig: {
    styleSectionVisibilities: {
      visibility: false,
      typography: false,
      sizing: false,
      spacing: false,
      positioning: false,
      background: false,
      transform: false,
      transitions: false,
      layout: false,
      overflow: false,
      border: false,
      shadows: false,
      effects: false,
      states: false,
      interactions: false,
    },
  } as UiConfig,

  googleAuthRequiredEmailDomains: ["plasmic.app"],

  onboardingTours: false,

  newProjectModal: false,

  authUsersTab: false,

  /*
  Template tours should map projectId to tourId, this way when a user creates a new project
  by cloning a template, we can show them the tour for that template.
  */
  templateTours: {} as Record<string, string>,

  arbitraryCssSelectors: false,

  autoOpen: false,
};

Object.assign(DEFAULT_DEVFLAGS, DEFAULT_DEVFLAG_OVERRIDES);

export type DevFlagsType = typeof DEFAULT_DEVFLAGS;
export const DEVFLAGS = cloneDeep(DEFAULT_DEVFLAGS);

export function normalizeDevFlags(flags: DevFlagsType) {
  if (flags.variants) {
    flags.unconditionalEdits = true;
    flags.ephemeralRecording = true;
  }

  if (flags.debug) {
    flags.autoSave = false;
    flags.ccStubs = true;
    flags.logToConsole = true;
    flags.enableReactDevTools = true;
  }
}

export function applyDevFlagOverrides(
  target: DevFlagsType,
  overrides: Partial<DevFlagsType>
) {
  mergeSane(target, overrides);
  normalizeDevFlags(target);
}

export function applyPlasmicUserDevFlagOverrides(target: DevFlagsType) {
  mergeSane(target, {
    ancestorsBoxes: true,
    multiSelect: true,
    insert2022Q4: true,
    plexus: true,
    incrementalObservables: true,
    branching: true,
    comments: true,
    pageLayout: true,
    refActions: true,
    logToConsole: true,
    rightTabs: true,
    appAuth: true,
    focusable: true,
    envPanel: true,
    interactiveCanvas: true,
    hiddenDataSources: [] as string[],
    mainContentSlots: true,
    insertTemplatesIntoMainContentSlots: true,
    simplifiedScreenVariants: true,
    simplifiedForms: true,
    schemaDrivenForms: true,
    onboardingTours: true,
    showInsertableTemplateComponents: true,
    advancedAppAuth: true,
    posthog: true,
    linting: true,
    componentThumbnails: true,
    authUsersTab: true,
    warningsInCanvas: true,
    previewSteps: true,
    arbitraryCssSelectors: true,
    autoOpen: true,
  } as Partial<DevFlagsType>);
}

const perProjectFlags: (keyof DevFlagsType)[] = [
  "usePlasmicImg",
  "usePlasmicTranslation",
  "useLoadingState",
  "useWhitespaceNormal",
];

export function getProjectFlags(
  site: {
    flags: { [f: string]: string | number | boolean | null | undefined };
  },
  target = DEVFLAGS
): DevFlagsType {
  return Object.assign(
    JSON.parse(JSON.stringify(target)),
    pick(site.flags, perProjectFlags)
  );
}
