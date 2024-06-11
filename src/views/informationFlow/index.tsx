import FlowList from 'src/components/informationFlow/list'
import { InformationFlowContext } from 'src/context/informationFlowContext'

const InformationFlow = () => {
  return (
    <InformationFlowContext>
      <FlowList />
    </InformationFlowContext>
  )
}

export default InformationFlow
