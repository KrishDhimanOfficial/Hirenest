
const siteControllers = {
    renderHomePage: async (req, res) => {
        try {
            return res.render('site/home',
                {
                    layout: './layout/site',
                    title: 'Home'
                }
            )
        } catch (error) {
            console.log('renderHomePage : ' + error.message)
        }
    },
}

export default siteControllers