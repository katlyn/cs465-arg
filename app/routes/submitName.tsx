import type {V2_MetaFunction} from "@remix-run/react";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {ActionArgs, json, LoaderArgs, redirect} from "@remix-run/node";
import {commitSession, getSession} from "~/sessions";
import {getSecond, getThird, names} from "~/keys.server";
import prisma from "~/prisma.server";

export const meta: V2_MetaFunction<typeof loader> = ({data}) => {
    return [{title: "Part three, nearly there!"}];
};

export const action = async ({request}: ActionArgs) => {
    const session = await getSession(request.headers.get("Cookie"))
    const formData = await request.formData()
    const name = formData.get("name") as string | null

    const user = session.get("user")
    if (user === undefined) {
        return redirect("/")
    }
    if (!session.get("doneSecond")) {
        return redirect("/second")
    }
    if (!session.get("doneThird")) {
        return redirect("/second")
    }

    if (name === null || name.trim() == "") {
        return json("empty")
    }
    try {
        await prisma.leaderboardEntry.create({
            data: {
                user,
                name
            }
        })
    } catch {
        return json("exists")
    }
    return redirect("/")
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
    if (!session.get("doneThird")) {
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
            <p>Congrats, {name}! You've solved all the puzzles and have successfully become a member of the ARG Completionist Club. Go ahead and enter a display name below to claim your place on the leaderboard.</p>
            <Form method="post">
                <label>{didError ? (
                    didError === "exists" ? (<span style={{color: "red"}}>You have already joined the leaderboard.</span>)
                        : (<span style={{color: "red"}}>Provide a display name.</span>)
                ) : "Enter your preferred display name:"} </label>
                <input name="name" type="text"/>
                <button type="submit">Submit</button>
            </Form>
        </div>
    );
}
