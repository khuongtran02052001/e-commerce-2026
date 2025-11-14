import { type SchemaTypeDefinition } from 'sanity';

import { addressType } from './addressType';
import { authorType } from './authType';
import { bannerType } from './bannerType';
import { blockContentType } from './blockContentType';
import { blogCategoryType } from './blogCategoryType';
import { blogType } from './blogType';
import { brandType } from './brandTypes';
import { categoryType } from './categoryType';
import { contactType } from './contactType';
import { orderType } from './orderType';
import { productType } from './productType';
import { reviewType } from './reviewType';
import { sentNotificationType } from './sentNotificationType';
import { subscriptionType } from './subscriptionType';
import { userAccessRequestType } from './userAccessRequestType';
import { userType } from './userType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    productType,
    orderType,
    bannerType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
    contactType,
    sentNotificationType,
    userType,
    userAccessRequestType,
    reviewType,
    subscriptionType,
  ],
};
