import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvoiceItem {
  producto: string;
  cantidad: number;
  valorUnitario: number;
  total: number;
}

interface InvoiceTemplateProps {
  invoiceNumber: string;
  saleNumber: string;
  date: string;
  customerName: string;
  customerDocument?: string;
  customerDocumentType?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  metodoPago?: string;
}

export const InvoiceTemplate = ({
  invoiceNumber,
  saleNumber,
  date,
  customerName,
  customerDocument,
  customerDocumentType,
  customerPhone,
  customerEmail,
  items,
  subtotal,
  tax,
  total,
  metodoPago,
}: InvoiceTemplateProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDocumentType = (type?: string) => {
    if (!type) return "";
    const types: Record<string, string> = {
      CC: "Cédula",
      CE: "Cédula Extranjería",
      NIT: "NIT",
      PAS: "Pasaporte",
    };
    return types[type] || type;
  };

  return (
    <Html>
      <Head />
      <Preview>Factura Electrónica - {invoiceNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Encabezado dorado */}
          <Section style={headerSection}>
            <Row>
              <Column style={{ width: "60%" }}>
                <Text style={companyNameLarge}>Autovidrios V&F</Text>
                <Text style={companySubtitle}>World Class Glass</Text>
                <Text style={invoiceType}>Factura de Venta</Text>
              </Column>
              <Column style={{ width: "40%", textAlign: "right" as const }}>
                <Text style={companyInfo}>Cl. 64 #28-46, Bogotá</Text>
                <Text style={companyInfo}>Tel: +57-3113688995</Text>
                <Text style={companyInfo}>Email: info@autovidriosvf.com</Text>
                <Text style={companyInfo}>NIT: 900123456-7</Text>
              </Column>
            </Row>
          </Section>

          {/* Información de la factura */}
          <Section style={contentSection}>
            <Text style={invoiceNumberText}>Factura No. {invoiceNumber}</Text>
            
            <Row style={{ marginTop: "10px", marginBottom: "20px" }}>
              <Column style={{ width: "50%" }}>
                <Text style={infoText}>Venta: {saleNumber}</Text>
              </Column>
              <Column style={{ width: "50%", textAlign: "right" as const }}>
                <Text style={infoText}>Fecha: {formatDate(date)}</Text>
              </Column>
            </Row>

            {/* Datos del Cliente */}
            <Text style={sectionTitle}>Datos del Cliente</Text>
            <Text style={detailText}>Nombre: {customerName}</Text>
            {customerDocument && customerDocumentType && (
              <Text style={detailText}>
                {formatDocumentType(customerDocumentType)}: {customerDocument}
              </Text>
            )}
            {customerPhone && (
              <Text style={detailText}>Teléfono: {customerPhone}</Text>
            )}
            {customerEmail && (
              <Text style={detailText}>Email: {customerEmail}</Text>
            )}

            {/* Tabla de productos */}
            <Section style={tableWrapper}>
              <Row style={tableHeaderRow}>
                <Column style={{ ...tableHeaderCell, width: "50%" }}>
                  <Text style={tableHeaderText}>Producto</Text>
                </Column>
                <Column style={{ ...tableHeaderCell, width: "15%", textAlign: "center" as const }}>
                  <Text style={tableHeaderText}>Cant.</Text>
                </Column>
                <Column style={{ ...tableHeaderCell, width: "20%", textAlign: "right" as const }}>
                  <Text style={tableHeaderText}>Valor Unit.</Text>
                </Column>
                <Column style={{ ...tableHeaderCell, width: "15%", textAlign: "right" as const }}>
                  <Text style={tableHeaderText}>Total</Text>
                </Column>
              </Row>
              
              {items.map((item, index) => (
                <Row key={index} style={tableRow}>
                  <Column style={{ ...tableCell, width: "50%" }}>
                    <Text style={tableCellText}>{item.producto}</Text>
                  </Column>
                  <Column style={{ ...tableCell, width: "15%", textAlign: "center" as const }}>
                    <Text style={tableCellText}>{item.cantidad}</Text>
                  </Column>
                  <Column style={{ ...tableCell, width: "20%", textAlign: "right" as const }}>
                    <Text style={tableCellText}>{formatCurrency(item.valorUnitario)}</Text>
                  </Column>
                  <Column style={{ ...tableCell, width: "15%", textAlign: "right" as const }}>
                    <Text style={tableCellText}>{formatCurrency(item.total)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Totales */}
            <Section style={totalsSection}>
              <Row>
                <Column style={{ width: "60%" }} />
                <Column style={{ width: "40%" }}>
                  <Row style={totalLine}>
                    <Column style={{ width: "50%", textAlign: "right" as const }}>
                      <Text style={totalLabel}>Subtotal:</Text>
                    </Column>
                    <Column style={{ width: "50%", textAlign: "right" as const }}>
                      <Text style={totalValue}>{formatCurrency(subtotal)}</Text>
                    </Column>
                  </Row>
                  <Row style={totalLine}>
                    <Column style={{ width: "50%", textAlign: "right" as const }}>
                      <Text style={totalLabel}>IVA (19%):</Text>
                    </Column>
                    <Column style={{ width: "50%", textAlign: "right" as const }}>
                      <Text style={totalValue}>{formatCurrency(tax)}</Text>
                    </Column>
                  </Row>
                  <Row style={totalLine}>
                    <Column style={{ width: "50%", textAlign: "right" as const }}>
                      <Text style={totalLabelLarge}>TOTAL:</Text>
                    </Column>
                    <Column style={{ width: "50%", textAlign: "right" as const }}>
                      <Text style={totalValueLarge}>{formatCurrency(total)}</Text>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            {/* Método de pago */}
            {metodoPago && (
              <Text style={paymentMethod}>Método de Pago: {metodoPago}</Text>
            )}

            {/* Pie de página */}
            <Section style={footerSection}>
              <Text style={footerText}>Gracias por su compra</Text>
              <Text style={footerText}>Autovidrios V&F - World Class Glass</Text>
              <Text style={footerTextSmall}>Esta es una factura generada electrónicamente</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Utils
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Styles - Matching PDF design
const main = {
  backgroundColor: "#ffffff",
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "800px",
  width: "100%",
};

const headerSection = {
  backgroundColor: "#C0A458", // Royal Gold
  padding: "20px",
  color: "#ffffff",
};

const companyNameLarge = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 5px 0",
  lineHeight: "1.2",
};

const companySubtitle = {
  color: "#ffffff",
  fontSize: "12px",
  margin: "0 0 5px 0",
  lineHeight: "1.2",
};

const invoiceType = {
  color: "#ffffff",
  fontSize: "12px",
  margin: "0",
  lineHeight: "1.2",
};

const companyInfo = {
  color: "#ffffff",
  fontSize: "9px",
  margin: "0 0 3px 0",
  lineHeight: "1.3",
};

const contentSection = {
  padding: "20px",
};

const invoiceNumberText = {
  color: "#141820", // Almost Black
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
};

const infoText = {
  color: "#141820",
  fontSize: "10px",
  margin: "0",
};

const sectionTitle = {
  color: "#141820",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "20px 0 8px 0",
};

const detailText = {
  color: "#141820",
  fontSize: "10px",
  margin: "0 0 6px 0",
  lineHeight: "1.4",
};

const tableWrapper = {
  marginTop: "15px",
  border: "1px solid #e0e0e0",
};

const tableHeaderRow = {
  backgroundColor: "#f0f0f0", // Light gray
};

const tableHeaderCell = {
  padding: "8px 10px",
  borderRight: "1px solid #e0e0e0",
};

const tableHeaderText = {
  color: "#141820",
  fontSize: "10px",
  fontWeight: "bold",
  margin: "0",
};

const tableRow = {
  borderBottom: "1px solid #e0e0e0",
};

const tableCell = {
  padding: "7px 10px",
  borderRight: "1px solid #e0e0e0",
};

const tableCellText = {
  color: "#646872", // Medium Grey
  fontSize: "10px",
  margin: "0",
  lineHeight: "1.4",
};

const totalsSection = {
  marginTop: "10px",
};

const totalLine = {
  marginBottom: "6px",
};

const totalLabel = {
  color: "#141820",
  fontSize: "10px",
  margin: "0",
  paddingRight: "10px",
};

const totalValue = {
  color: "#141820",
  fontSize: "10px",
  margin: "0",
};

const totalLabelLarge = {
  color: "#141820",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "0",
  paddingRight: "10px",
};

const totalValueLarge = {
  color: "#141820",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "0",
};

const paymentMethod = {
  color: "#646872",
  fontSize: "10px",
  margin: "20px 0 0 0",
};

const footerSection = {
  marginTop: "40px",
  paddingTop: "20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#646872",
  fontSize: "8px",
  margin: "0 0 5px 0",
  textAlign: "center" as const,
};

const footerTextSmall = {
  color: "#646872",
  fontSize: "8px",
  margin: "0",
  textAlign: "center" as const,
};

export default InvoiceTemplate;
