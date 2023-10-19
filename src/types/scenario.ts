export type ScenarioCategoryType = {
  name: string;
  subCategory: string | null;
};

export type ScenarioCategoryBranchType = {
  name: string;
  subCategories: string[];
};

export type ScenariosCategoryTreeType = ScenarioCategoryBranchType[];
