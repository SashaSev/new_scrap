const Crawler = require("simplecrawler");
const express = require("express");
const cors = require("cors");
const isValidDomain = require('is-valid-domain')


const app = express();
app.use(express.json());
app.use(cors())

app.post("/scrap", (req, res) => {
        try {
            let {website} = req.body
            // if (!isValidDomain(website)) {
            //    return res.json({status: 400, data: "Domain not valid"})
            // }
            if (website.startsWith("https://")) {
                website = website.substr(8)
            }
            const crawler = new Crawler(`https://${website}`);
            crawler.start();
            const urlCountByStatusCode = {}
            crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
                console.log("I just received %s (%d status code)", queueItem.url, response.statusCode);
                urlCountByStatusCode.hasOwnProperty(response.statusCode) ?
                    urlCountByStatusCode[response.statusCode] += 1 :
                    urlCountByStatusCode[response.statusCode] = 1
            });
            crawler.on("complete", () => {
                return res.json({status: 200, data: urlCountByStatusCode})
            })
        } catch (e) {
            throw new Error(e.message);
        }
    }
)


app.listen(8000, () => {
    console.log("server listening 8000")
})