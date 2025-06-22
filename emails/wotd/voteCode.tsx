import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VoteWrestlerProps {
  magicLink?: string;
}

export const VoteWrestler = ({ magicLink }: VoteWrestlerProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Vote with Vote Link</Preview>
      <Container style={container}>
        <Heading style={heading}>🤼‍♂️ Your Vote Link</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            <Link style={link} href={magicLink}>
              👉 Click here to Vote 👈
            </Link>
          </Text>
          <Text style={paragraph}>
            If you didn&apos;t request this, please ignore this email.
          </Text>
        </Section>
        <Text style={paragraph}>
          You can also copy the code below and navigate directly here to vote.
        </Text>
        <Text style={paragraph}>{magicLink}</Text>
        <Hr style={hr} />
        <Text style={footer}>Weditoh</Text>
      </Container>
    </Body>
  </Html>
);

VoteWrestler.PreviewProps = {
  magicLink: "https://raycast.com",
} as VoteWrestlerProps;

export default VoteWrestler;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/static/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
