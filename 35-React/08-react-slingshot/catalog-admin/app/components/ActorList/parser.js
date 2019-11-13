import config from '../../config/appConfig';
import { CONTENT_STATUS } from "../ContentsChooser/common/constants";

const DEFAULT_PRODUCT_IMAGE = `${
  config.BUCKET_URL
}/static/images/common/profile_thumbnail.svg`;

export function actorListParser(metaInfo, actors) {
  const parsedData = {
    headers: [],
    data: [],
  };

  metaInfo.headers.map(info => {
    parsedData.headers.push({
      title: info.title,
      classes: info.classes,
      type: info.type,
      data_key: info.data_key,
    });
  });

  actors.map(actor => {
    let selectedImage = selectedActorImages(actor.actor_data.images);
    selectedImage = selectedImage
      ? selectedImage.thumbnails && selectedImage.thumbnails.small
      : DEFAULT_PRODUCT_IMAGE;
    parsedData.data.push({
      id: actor.id,
      avatarInfo: {
        profileImage: selectedImage,
        userName: actor.actor_data.name,
      },
      email: actor.actor_data.email,
      phone_number: actor.actor_data.phone_number,
      address: actor.actor_data.address,
      notes: actor.actor_data.notes,
    });
  });
  return parsedData;
}

export function selectedActorImages(images) {
  return images.find(file => file.status === CONTENT_STATUS.MAPPED);
}
