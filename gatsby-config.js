module.exports = {
  siteMetadata: {
    title: `Gravity Simulator`,
    author: `Darrell Huffman`,
    lang: `en`,
    description: `Gravity simulations in 3D of the solar system, choreographies, exoplanets and even colliding galaxies. You can add, delete and modify any mass in a simulation.`
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-less`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
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
    }
  ]
};
