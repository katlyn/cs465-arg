import type {V2_MetaFunction} from "@remix-run/react";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {ActionArgs, json, LoaderArgs, redirect} from "@remix-run/node";
import {commitSession, getSession} from "~/sessions";
import {getSecond, getThird, names} from "~/keys.server";

export const meta: V2_MetaFunction<typeof loader> = ({data}) => {
    return [{title: "Part three, nearly there!"}];
};

export const action = async ({request}: ActionArgs) => {
    const session = await getSession(request.headers.get("Cookie"))
    const formData = await request.formData()
    const key = Number(formData.get("key"))

    const user = session.get("user")
    if (user === undefined) {
        return redirect("/")
    }
    if (!session.get("doneSecond")) {
        return redirect("/second")
    }
    if (getThird(user) !== key) {
        return json(true)
    }
    session.set("doneThird", true)
    return redirect("/submitName", {
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    })
}

export const loader = async ({request}: LoaderArgs) => {
    const session = await getSession(request.headers.get("Cookie"))
    const user = session.get("user")
    if (user === undefined) {
        return redirect('/')
    }
    if (!session.get("doneSecond")) {
        return redirect("/second")
    }

    const name = names[user]
    return json(name)
}

export default function Index() {
    const didError = useActionData<typeof action>()
    const name = useLoaderData<typeof loader>()
    return (
        <div style={{fontFamily: "serif", lineHeight: "1.4"}}>
            <p>Nice job, {name}! Now you just need to join the ARG Completionist Club, I hear they posted a flyer somewhere on the fifth floor of Duckering...</p>
            <Form method="post">
                <label>{didError ? (<span style={{color: "red"}}>That is not the solution.</span>) : "Enter the solution:"} </label>
                <input name="key" type="text"/>
                <button type="submit">Submit</button>
            </Form>
        </div>
    );
}
