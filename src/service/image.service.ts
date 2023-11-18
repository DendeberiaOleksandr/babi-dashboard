import axios from "axios";

export const uploadImage = async (file: File, user: any): Promise<any> => {
    const imageForm = new FormData();
      imageForm.append("file", file);
      const res = await axios
        .post(process.env.NEXT_PUBLIC_API_URL + "/images", imageForm, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
    return res.data;
}