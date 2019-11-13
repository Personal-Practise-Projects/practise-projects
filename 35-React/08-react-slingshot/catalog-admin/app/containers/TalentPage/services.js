import AxiosBuilder from '../../common/axiosBuilder';
import { TALENT_DATA_API_ENDPOINT, TALENT_META_INFO_API_ENDPOINT } from '../../common/constants';

export const fetchTalentData = (successCallback, uniqueCode) => {
  new AxiosBuilder(`${TALENT_DATA_API_ENDPOINT}${uniqueCode}/`)
    .fetch()
    .then(response => successCallback(response.data));
};
export const fetchTalentConfig = successCallback => {
  new AxiosBuilder(TALENT_META_INFO_API_ENDPOINT)
    .fetch()
    .then(response => successCallback(response.data.meta_info));
};
