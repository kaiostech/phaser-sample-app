export const centerGameObjects = (objects) => {
    objects.forEach((object) => {
        object.setOrigin(0.5);
    });
};
