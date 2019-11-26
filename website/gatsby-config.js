module.exports = {
  plugins: [
    {
      resolve: "react-ui-doc",
      options: {
        name: '@deer-ui docs',
        slug: '@deer-ui',
        github: 'https://github.com/minimal-studio/deer-ui',
        siteUrl: 'https://ui.thinkmore.xyz',
        author: 'Alex',
        menu: [
          'Getting Started',
          'Style',
          'Layout',
          'Form',
          'Form Generator',
          'Navigation',
          'Feedback',
          'Data Display',
          'Utils',
          'Enhance-UI',
        ],
        nav: [{ title: 'Docs', url: '/docs/' }],
        basePath: ".",
        docPath: `${__dirname}/src/pages/docs`,
        pagePath: `${__dirname}/src/pages`,
        imagePath: `${__dirname}/src/images`,
        analytics: {
          trackingId: `UA-125030746-1`,
          head: false,
        },
        theme: {
          defaultMode: 'light',
          colors: {
            light: {
              body: '#FFF'
            },
            dark: {
              body: '#000'
            }
          }
        }
      },
    },
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve(`./src/components/layout`),
      }
    }
  ],
};
