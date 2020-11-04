import administrationRouter from '~/routes/v1/bbb/administration.route';
import monitoringRouter from '~/routes/v1/bbb/monitoring.route';
import recordingRouter from '~/routes/v1/bbb/recording.route';

const get = async (req, res) => {
  await res.sendStatus(204);
};

export { administrationRouter, monitoringRouter, recordingRouter, get };
