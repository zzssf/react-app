import FlowList from '../../components/informationFlow/list'
import { InformationFlowContext } from '../../context/informationFlowContext'

const InformationFlow = () => {
  return (
    <InformationFlowContext>
      <FlowList />
    </InformationFlowContext>
  )
}

export default InformationFlow
