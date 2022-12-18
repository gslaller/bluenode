import { get } from "svelte/store";
import { user } from "../store/user";
import { useNavigate } from "svelte-navigator";

export default function navigateToSettings() {
    const navigate = useNavigate();
    let name = get(user).name;

    if (name === "") {
        navigate("/settings");
    }

}