import * as React from 'react';
import { 
CardTitle,
Text, TextContent, TextVariants
} from '@patternfly/react-core';

const CardWithTitle = (props) => {
  return (
     <CardTitle>
      <Text component={TextVariants.p}>
        {props.title}
      </Text>
      <TextContent>
        <Text component={TextVariants.small}>
            {props.info}
        </Text>
      </TextContent>
     </CardTitle>
  )
}

export default CardWithTitle;