const cron = require('node-cron');
const Subscriber = require('../models/Subscriber');

const monthName = ['', 'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const getMonthName = async (month) => {
    return monthName[month];
};

module.exports = {
    getMonthName,

    scheduledJob: async (id) => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        const seconds = d.getSeconds();
        const min = d.getMinutes();
        const hour = d.getHours();
        const date = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();

        const timeZoneNG = 'Africa/Lagos';

        const cronExpression = `${seconds >= 59 ? 1 : seconds} ${min > 59 ? 59 : min} ${hour} ${date} ${month + 1} *`;

        const cronExpressionVIP = `${seconds >= 59 ? 1 : seconds} ${min +1} ${hour} ${date} ${month + 1} *`;

        console.log(cronExpression);

        try {
            cron.schedule(
                cronExpression,
                async () => {
                    try {
                        const subscriber = await Subscriber.findOne({ _id: id, subscription: true });

                        if (!subscriber) {
                            console.log('Subscriber not found or subscription inactive.');
                            return;
                        }

                        const monthName = await getMonthName(month + 1);

                        await Subscriber.updateOne(
                            { _id: id },
                            {
                                $push: {
                                    payment: {
                                        month: monthName,
                                        year: year,
                                        status: false
                                    }
                                }
                            }
                        );

                        console.log(`Task completed successfully with id ${id} at ${date}/${hour}:${min}`);
                        console.log('Subscriber:', subscriber);

                        // Schedule the next job after 1 minute
                        setTimeout(() => {
                            module.exports.scheduledJob(id);
                        }, 60 * 1000); // 1 minute

                    } catch (error) {
                        console.log('Error inside cron job:', error);
                    }
                },
                {
                    scheduled: true,
                    timezone: timeZoneNG
                }
            );
        } catch (error) {
            console.log('Error in cron.schedule:', error);
        }
    }
};
