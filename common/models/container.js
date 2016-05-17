module.exports = function(Container) {
  Container.afterRemote('upload', function(ctx, modelInstance, next) {
    const file = modelInstance.result.files.file[0];
    console.log(file);
  });
};
