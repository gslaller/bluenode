import { writable } from 'svelte/store';
import { v4 } from 'uuid';

export const user = writable({
    uuid: v4(),
    name: ""
});

export function deleteUser() {
    user.set({
        uuid: v4(),
        name: ""
    });
}

export function newName(name: string) {
    if (!ValidName(name)) {
        return;
    }
    user.update((user) => ({
        uuid: user.uuid,
        name: name
    }));
}

export function ValidName(name: string) {
    return name.length > 0;
}

export function RandomName() {
    user.update((user) => ({
        uuid: user.uuid,
        name: v4()
    }));
}