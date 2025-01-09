const UnionSection = () => {
    return (
      <section className="bg-white text-muted py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Autovidrios V&F
            </h2>
            <div className="relative">
              <h3 className="text-lg mb-6">Vidrios de calidad para carros</h3>
              <div className="absolute top-8 left-0 w-16 h-0.5 bg-primary"></div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Somos una empresa colombiana con más de 10 años de experiencia en la venta e instalación de vidrios automotrizes y parabrisas. Además somos especialistas en mantenimientos de vehiculos blindados e instalación de Sunroof, entregamos vidrios en muchas ciudades de Colombia entre las cuales destacan Bogotá, Medellín, Cartagena, Cali, Pereira, Manizales.
            </p>
          </div>
  
          {/* Right Column */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              World Class Glass
            </h2>
            <div className="relative">
              <h3 className="text-lg mb-6">Hemos cambiado para mejorar</h3>
              <div className="absolute top-8 left-0 w-16 h-0.5 bg-blue-500"></div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Autovidrios V&F se ha unído con World Class Glass. Esta unión nace con el proposito de brindarle al mercado colombiano la mejor calidad y seguridad con los productos para sus vehiculos, cubriendo no solamente venta e instalación de vidrios automotrizes y parabrisas, sino también polarizados, peliculas antirobo y mucho más. <span className="font-bold">(Ver sección productos, para mayor información)</span>
            </p>
          </div>
        </div>
      </section>
    )
  }

  export default UnionSection
  
  