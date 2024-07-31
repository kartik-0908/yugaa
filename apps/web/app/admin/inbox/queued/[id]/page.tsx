import RightPanelToggle, { EventCard } from "../../Collapsible";

export default  function ticket({ params }: any) {
    return (
        <RightPanelToggle id={params.id} />
    )
}
