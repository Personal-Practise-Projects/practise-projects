import ComponentRenderFactory from '../ComponentFactory';

export function AllowedFeature(props) {
  return props.features.map((header, index) =>
    ComponentRenderFactory.component(header, index, props.dataHandler),
  );
}
