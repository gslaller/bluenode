import { writable } from 'svelte/store';
import { v4 } from 'uuid';

type roomProps = {

    name: string,

}

export const room = writable<roomProps>({
    name: "hard_coded",

});
