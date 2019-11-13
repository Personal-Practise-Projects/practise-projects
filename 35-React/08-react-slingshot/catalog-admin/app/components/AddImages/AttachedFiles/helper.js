import excel from '../../../images/Icons/excel-icon.svg';
import doc from '../../../images/Icons/wordfile-icon.svg';
import pdf from '../../../images/Icons/pdf-icon.svg';
import errSrc from '../../../images/content-widget/imagecontent.svg';
import ppt from '../../../images/Icons/ppt.svg';
import zip from '../../../images/Icons/zip.svg';
import ttf from '../../../images/Icons/text-file.svg';

export function getErrorSrcForFileName(fileName) {
  const extension = fileName
    .split('.')
    .pop()
    .toLowerCase();
  switch (extension) {
    case 'docx':
    case 'doc':
      return doc;
    case 'zip':
      return zip;
    case 'xls':
    case 'xlsx':
      return excel;
    case 'ttf':
      return ttf;
    case 'pdf':
      return pdf;
    case 'ppt':
    case 'pptx':
      return ppt;
    default:
      return errSrc;
  }
}
