var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var emails_config = require('../../config/emails_config');

module.exports = class UsefulFunctions {
    constructor() {
    }

    //create a random string
    makeRandomString(nums) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 1; i < nums; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    //private function to send a mail
    sendEmail(emaildest, message, object_mail, text_option) {
        return new Promise(function (resolve, reject) {
            if (emaildest == 'admin') {
                emaildest = emails_config.EMAIL_ADDRESS;
            }
            var regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (emaildest != 'admin' && !regularExpression.test(String(emaildest).toLowerCase())) {
                reject({
                    title: 'Mail error',
                    message: 'An error occurred while sending mail'
                });
            }
            else {
                //Transporter with OAuth2
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        type: 'OAuth2',
                        user: emails_config.EMAIL_ADDRESS,
                        clientId: emails_config.clientId,
                        clientSecret: emails_config.clientSecret,
                        refreshToken: emails_config.refreshToken,
                        expires: 1484314697598
                    }
                });

                //mail options
                var mailOptions;
                if (text_option == "text") {
                    mailOptions = {
                        to: emaildest,
                        subject: object_mail,
                        text: message
                    };
                }
                else if (text_option == "html") {
                    mailOptions = {
                        to: emaildest,
                        subject: object_mail,
                        html: message
                    };
                }


                //send the mail
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        reject({
                            title: 'Mail error',
                            message: 'An error occurred while sending mail'
                        });
                    } else {
                        resolve({
                            title: 'Mail Success',
                            message: 'Your message has been successfully sent'
                        });
                    }
                });

            }
        });
    }

    //private function to send a mail with one attachment
    sendEmailWithAttachment(emaildest, message, object_mail, text_option, attachment) {
        return new Promise(function (resolve, reject) {
            if (emaildest == 'admin') {
                emaildest = emails_config.EMAIL_ADDRESS;
            }
            var regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (emaildest != 'admin' && !regularExpression.test(String(emaildest).toLowerCase())) {
                reject({
                    title: 'Mail error',
                    message: 'An error occurred while sending mail'
                });
            }
            else {
                //Transporter with OAuth2
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        type: 'OAuth2',
                        user: emails_config.EMAIL_ADDRESS,
                        clientId: emails_config.clientId,
                        clientSecret: emails_config.clientSecret,
                        refreshToken: emails_config.refreshToken,
                        expires: 1484314697598
                    }
                });

                //mail options
                var mailOptions;
                if (text_option == "text") {
                    mailOptions = {
                        to: emaildest,
                        subject: object_mail,
                        text: message,
                        attachments: [
                            {
                                filename: attachment.filename,
                                content: attachment.content,
                                contentType: attachment.contentType
                            }]
                    };
                }
                else if (text_option == "html") {
                    mailOptions = {
                        to: emaildest,
                        subject: object_mail,
                        html: message,
                        attachments: [
                            {
                                filename: attachment.filename,
                                content: attachment.content,
                                contentType: attachment.contentType
                            }]

                    };
                }


                //send the mail
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        reject({
                            title: 'Mail error',
                            message: 'An error occurred while sending mail'
                        });
                    } else {
                        resolve({
                            title: 'Mail Success',
                            message: 'Your message has been successfully sent'
                        });
                    }
                });

            }
        });
    }

    //offline reviews of fb
    getOfflineReviews() {
        return [
            {
                created_time: "2018-03-06T22:06:07+0000",
                reviewer: {
                    name: "Dana Saado"
                },
                rating: 5,
                review_text: "גבי, מאמן מספר 1!!! תמיד עם חיוך, מוטיבציה אינסופית, מקצועי במאה אחוז!!!! מעבירהאת האימון בכיף עם המון הקשבה ותשומת לב לפרטים הקטנים... אין עוד כמוך!!!! נדיר!!!! כיף לי שאתה המאמן שלי!"
            },
            {
                created_time: "2018-03-05T17:14:44+0000",
                reviewer: {
                    name: "Sahar Zangi"
                },
                rating: 5,
                review_text: "High Level"
            },
            {
                created_time: "2018-03-04T13:57:59+0000",
                reviewer: {
                    name: "מירי צדיק"
                },
                rating: 5,
                review_text: "מומלץ בחום להתאמן אצל גבריאל, עובד עם כל הלב!"
            },
            {
                created_time: "2018-02-27T21:59:54+0000",
                reviewer: {
                    name: "David Azulay"
                },
                rating: 5,
                review_text: "גבי מאמן מצויין! ממליץ בחום!"
            },
            {
                created_time: "2018-02-07T09:39:36+0000",
                reviewer: {
                    name: "Yona Levi"
                },
                rating: 5,
                review_text: "גבריאל מאמן כושר עם  כל הלב, דואג שאת עובדת נכון  משלב את האימון  בקיצור מאמן מקסים  ומקצועי"
            },
            {
                created_time: "2018-02-07T06:34:45+0000",
                reviewer: {
                    name: "Shlomi Luzon"
                },
                rating: 5,
                review_text: ""
            },
            {
                created_time: "2018-02-06T19:19:22+0000",
                reviewer: {
                    name: "Ksenia Kozodoi"
                },
                rating: 5,
                review_text: "גבריאל מאמן כושר מקצועי ורציתי בעל חוש הומור טוב ובזכות זה האימונים עוברים בכייף . יש לו גישה לאימונים יצירתית והוא מתאם את התוכנית האימונים לכל אחד אינדיבידואלי .בנוסף שהוא מאמן מצויין הוא גם איש טוב . מתאמנת איתו תקופה לא ערוכה אבל כבר רואה תוצאות ממש טובות וממש נהנת מהאימונים . ממליצה בחום ובאהבה ."
            },
            {
                created_time: "2018-02-06T15:09:59+0000",
                reviewer: {
                    name: "Souty Ben"
                },
                rating: 5,
                review_text: "אחלה מאמן מקצועי ביותר ויחס אישי ברמה גבוה!!"
            },
            {
                created_time: "2018-02-06T14:37:50+0000",
                reviewer: {
                    name: "Caroline Ohayon"
                },
                rating: 5,
                review_text: "מאמן כושר מקצועי סבלן  אין עליו הדרכה ליווי הסברים מומלץ בחום"
            },
            {
                created_time: "2018-02-06T14:28:49+0000",
                reviewer: {
                    name: "Noa Kirshenboim"
                },
                rating: 5,
                review_text: ""
            },
            {
                created_time: "2018-02-06T12:08:25+0000",
                reviewer: {
                    name: "Caspit De Loya"
                },
                rating: 5,
                review_text: "גבריאל התותח בונה תכנית אימונים המתאימה אישית למתאמן תוך התחשבות בהעדפותיו וצרכיו תוך גיוון ודרבון נצחי.מי שיתאמן בהדרכת גבריאל יזכה"
            },
            {
                created_time: "2018-02-05T21:11:54+0000",
                reviewer: {
                    name: "אסף פוגץ"
                },
                rating: 5,
                review_text: "גבריאל מאמן שלי בחדר כושר שבו אני מתאמן 1 מהממים הכי טובים שי שלי בחדר כושר לא מוותר קשוח שצריך ובעיקר חייכן סבלני למתאמנים שלו אפשר להגיד אפילו הפח לחבר ממליץ בחום להתאמן איתו"
            },
            {
                created_time: "2018-02-05T18:33:50+0000",
                reviewer: {
                    name: "Shifra Erez"
                },
                rating: 5,
                review_text: "ממליצה בחום, מדריך מעולה, אימון מכל הלב , קשוב ואכפתי מאוד."
            },
            {
                created_time: "2018-02-04T11:20:43+0000",
                reviewer: {
                    name: "Siham Shweiki"
                },
                rating: 5,
                review_text: "Dear Gabi , when it comes to working out with you your expectations are sky high , I have to admit you sometimes make me cry , but in the end i break out in smile , thank you for making me better and stronger , thank you for pushing me beyond my limits �"
            },
            {
                created_time: "2018-02-04T10:14:02+0000",
                reviewer: {
                    name: "Eli Svetov"
                },
                rating: 5,
                review_text: "גבריאל מאמן קשוב ואכפתי שדוחף אנשים קדימה ולא מוותר! מאמן נפלא, ואני נהנה מכל אימון איתו."
            },
            {
                created_time: "2018-02-04T07:58:29+0000",
                reviewer: {
                    name: "Rachel Moscati"
                },
                rating: 5,
                review_text: ""
            },
            {
                created_time: "2018-02-04T06:32:47+0000",
                reviewer: {
                    name: "Yosi Versano"
                },
                rating: 5,
                review_text: "גבריאל אני ממש נהנה מהמקצועיות שלך והשרות ממליץ בחום"
            },
            {
                created_time: "2018-02-01T15:30:59+0000",
                reviewer: {
                    name: "Chaim Stern"
                },
                rating: 5,
                review_text: ""
            },
            {
                created_time: "2018-02-01T08:59:32+0000",
                reviewer: {
                    name: "Chloe Dev"
                },
                rating: 5,
                review_text: "Le meilleur! Gabriel est complètement investi dans les entrainements pour arriver à nos \"objectifs bien-être\". Sérieux et très motivant. Je ne peux que le conseiller."
            },
            {
                created_time: "2018-01-31T18:29:32+0000",
                reviewer: {
                    name: "Mor Noach"
                },
                rating: 5,
                review_text: "אין על גבריאל!!!  מאמן תותח תמשיך ככה אין עליך!!!"
            },
            {
                created_time: "2018-01-30T19:57:44+0000",
                reviewer: {
                    name: "Grace Yaron"
                },
                rating: 5,
                review_text: "גבריאל הוא המאמן האידיאלי כשרוצים תוצאות. מאמן עם המון ידע וכריזמה , ממליצה עליו בחום ."
            },
            {
                created_time: "2018-01-30T10:34:40+0000",
                reviewer: {
                    name: "סימה שלום"
                },
                rating: 5,
                review_text: "אומנם אנחנו בתחילת הדרך, אבל מיד הבנתי עם מי יש לי עסק! גבריאל מאמן תרתי משמע! בסבלנות ותוך הקשבה להרגלים הגרועים שהיו לי... וביחד עם המון סבלנות, מקצועיות, חום ומסירות, אני סופסוף נדבקת בחיידק הספורט והאימון הגופני!!!! תודה רבה לך. אני שמחה בזכותך!"
            },
            {
                created_time: "2018-01-30T08:05:12+0000",
                reviewer: {
                    name: "Aurelia Edy Benshushan"
                },
                rating: 5,
                review_text: ""
            },
            {
                created_time: "2018-01-30T04:15:29+0000",
                reviewer: {
                    name: "Yaki Cohen"
                },
                rating: 5,
                review_text: "גבריאל מאמן כושר מקצועי ביותר בעך ידע עשיר מאמן מאוד אינטנסיבי שתמיד דוחף להצלחה  תמיד קשוב ומשנה תוכנית אימונים על פי הצורך יחס אישי ותומך לכל הדרך אדם מצחיק שמעביר את האימון כחוויה בלתי נשכחת."
            },
            {
                created_time: "2018-01-29T23:17:06+0000",
                reviewer: {
                    name: "Shmuel Kamil"
                },
                rating: 5,
                review_text: "מאמן מסור ומקצועי ביותר"
            }
        ];

    }

} 