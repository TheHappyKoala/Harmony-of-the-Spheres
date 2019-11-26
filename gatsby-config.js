const path = require(`path`);

module.exports = {
  siteMetadata: {
    title: `Gravity Simulator`,
    author: `Darrell Huffman`,
    lang: `en`,
    description: `3D Gravity Simulator. Simulate the solar system, exoplanets and even colliding galaxies. You can add, delete and modify any mass in a simulation.`
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-less`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data/`
      }
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://www.gravitysimulator.org`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`)
      }
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`
  ]
};
