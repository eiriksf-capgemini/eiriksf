import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ["out/**", ".next/**", "node_modules/**", "tools/verify-ui/**", "assets/**"],
  },
];
