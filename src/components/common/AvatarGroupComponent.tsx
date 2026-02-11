import AvatarComponent from "./AvatarComponent"
import { FC } from "react"

type Image = {
    source: string | null,
    id: string,
    fallback: string
}

type IProps = {
    images: Image[]
}

const AvatarGroupComponent: FC<IProps> = ({ images }) => {
    return (
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:grayscale">
            {images.map((eachImg, index) => (
                <AvatarComponent
                    sizePx={20}
                    key={`${eachImg.id}-${index}`}
                    fallback={eachImg.fallback}
                    source={eachImg.source ?? undefined}
                />
            ))}
        </div>
    )
}

export default AvatarGroupComponent
